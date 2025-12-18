#!/usr/bin/env ts-node
/**
 * Migration script: Jasmine to Vitest
 *
 * This script automatically converts Jasmine spy syntax to Vitest syntax:
 * - createSpyObj<Type>() → vi.mocked<Type>() with proper typing
 * - spy.calls.reset() → vi.clearAllMocks()
 * - spyOn() → vi.spyOn()
 * - .and.returnValue() → .mockReturnValue()
 * - .and.callFake() → .mockImplementation()
 * - Adds 'vi' import from 'vitest'
 */

import { globSync } from 'glob';
import { join } from 'path';
import { Project, SourceFile } from 'ts-morph';

const PROJECT_ROOT = process.cwd();

function migrateFile(sourceFile: SourceFile): boolean {
  let hasChanges = false;

  // 1. Check if file uses jasmine.createSpyObj or spyOn
  const text = sourceFile.getText();
  const hasJasmineSpyObj =
    text.includes('jasmine.createSpyObj') || text.includes('createSpyObj');
  const hasSpyOn = text.includes('spyOn(');
  const hasJasmineCalls = text.includes('.calls.reset()');
  const hasAndMethods =
    text.includes('.and.returnValue(') || text.includes('.and.callFake(');

  if (!hasJasmineSpyObj && !hasSpyOn && !hasJasmineCalls && !hasAndMethods) {
    return false; // Nothing to migrate
  }

  console.log(`  Migrating: ${sourceFile.getFilePath()}`);

  // 2. Remove jasmine createSpyObj import
  const createSpyObjImport = sourceFile.getStatements().find((stmt) => {
    return stmt
      .getText()
      .includes('import createSpyObj = jasmine.createSpyObj');
  });

  if (createSpyObjImport) {
    createSpyObjImport.remove();
    hasChanges = true;
  }

  // 3. Add vitest import if not exists
  const hasVitestImport = sourceFile
    .getImportDeclarations()
    .some((imp) => imp.getModuleSpecifierValue() === 'vitest');

  if (!hasVitestImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'vitest',
      namedImports: ['vi'],
    });
    hasChanges = true;
  } else {
    // Add 'vi' to existing vitest import if not present
    const vitestImport = sourceFile
      .getImportDeclarations()
      .find((imp) => imp.getModuleSpecifierValue() === 'vitest');
    if (vitestImport) {
      const namedImports = vitestImport.getNamedImports();
      const hasVi = namedImports.some((ni) => ni.getName() === 'vi');
      if (!hasVi) {
        vitestImport.addNamedImport('vi');
        hasChanges = true;
      }
    }
  }

  // 4. Replace createSpyObj calls with vi.mocked - robust parser
  let newText = sourceFile.getText();

  // Match optional 'jasmine.' prefix before createSpyObj
  const createSpyObjRegex = /(?:jasmine\.)?createSpyObj<([\s\S]+?)>\s*\(/g;
  let match;
  const replacements: Array<{
    start: number;
    end: number;
    replacement: string;
  }> = [];

  while ((match = createSpyObjRegex.exec(newText)) !== null) {
    const typeParam = match[1].trim();
    const startPos = match.index;
    const openParenPos = match.index + match[0].length - 1;

    // Manually find the matching closing paren
    let depth = 1;
    let pos = openParenPos + 1;
    const args: string[] = [];
    let currentArg = '';
    let inBraces = 0;

    while (pos < newText.length && depth > 0) {
      const char = newText[pos];

      if (char === '{') inBraces++;
      if (char === '}') inBraces--;

      if (inBraces === 0 && char === ',' && depth === 1) {
        args.push(currentArg.trim());
        currentArg = '';
        pos++;
        continue;
      }

      if (char === '(' && inBraces === 0) depth++;
      if (char === ')' && inBraces === 0) {
        depth--;
        if (depth === 0) {
          args.push(currentArg.trim());
          break;
        }
      }

      currentArg += char;
      pos++;
    }

    // Parse the arguments
    const methodsList: string[] = [];
    const propertiesList: string[] = [];

    // First arg might be a string name (skip it) or an object
    let firstArg = args[0] || '';
    let secondArg = args[1] || '';

    // If first arg is a quoted string, it's the name - skip it
    if (firstArg.match(/^['"].*['"]$/)) {
      firstArg = secondArg;
      secondArg = args[2] || '';
    }

    // Parse first object (methods)
    if (firstArg.startsWith('{')) {
      const methodContent = firstArg
        .substring(1, firstArg.lastIndexOf('}'))
        .trim();
      if (methodContent) {
        methodContent.split(/,\s*(?![^{]*})/g).forEach((m: string) => {
          const trimmed = m.trim();
          if (trimmed && !trimmed.startsWith('}')) {
            const methodName = trimmed.split(':')[0].trim();
            if (methodName) {
              methodsList.push(`${methodName}: vi.fn()`);
            }
          }
        });
      }
    }

    // Parse second object (properties)
    if (secondArg.startsWith('{')) {
      const propContent = secondArg
        .substring(1, secondArg.lastIndexOf('}'))
        .trim();
      if (propContent) {
        propContent.split(/,\s*(?![^{]*})/g).forEach((p: string) => {
          const trimmed = p.trim();
          if (trimmed && !trimmed.startsWith('}')) {
            propertiesList.push(trimmed);
          }
        });
      }
    }

    const allMembers = [...methodsList, ...propertiesList];
    let replacement;
    if (allMembers.length === 0) {
      replacement = `vi.mocked<Partial<${typeParam}>>({})`;
    } else {
      replacement = `vi.mocked<Partial<${typeParam}>>({\n    ${allMembers.join(',\n    ')}\n  })`;
    }

    replacements.push({
      start: startPos,
      end: pos + 1,
      replacement: replacement,
    });
  }

  // Apply replacements in reverse order to maintain indices
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { start, end, replacement } = replacements[i];
    newText =
      newText.substring(0, start) + replacement + newText.substring(end);
    hasChanges = true;
  }

  // 5. Replace spy.calls.reset() with vi.clearAllMocks()
  newText = newText.replace(
    /(\w+)\.(\w+)\.calls\.reset\(\)/g,
    (match, obj, method) => {
      hasChanges = true;
      return `vi.clearAllMocks()`;
    },
  );

  // 6. Replace spyOn() with vi.spyOn() (but not vi.spyOn)
  newText = newText.replace(/\bspyOn\(/g, (match, offset, string) => {
    // Don't replace if already prefixed with 'vi.'
    if (offset >= 3 && string.substring(offset - 3, offset) === 'vi.') {
      return match;
    }
    hasChanges = true;
    return 'vi.spyOn(';
  });

  // 7. Replace .and.returnValue() with .mockReturnValue()
  if (newText.includes('.and.returnValue(')) {
    newText = newText.replace(/\.and\.returnValue\(/g, '.mockReturnValue(');
    hasChanges = true;
  }

  // 8. Replace .and.callFake() with .mockImplementation()
  if (newText.includes('.and.callFake(')) {
    newText = newText.replace(/\.and\.callFake\(/g, '.mockImplementation(');
    hasChanges = true;
  }

  if (hasChanges) {
    sourceFile.replaceWithText(newText);
  }

  return hasChanges;
}

function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || 'apps/sample-app/src/**/*.spec.ts';

  console.log('🔄 Jasmine → Vitest Migration Script');
  console.log('=====================================\n');
  console.log(`Target: ${targetPath}\n`);

  const project = new Project({
    tsConfigFilePath: join(PROJECT_ROOT, 'tsconfig.base.json'),
  });

  // Find all spec files
  const pattern = join(PROJECT_ROOT, targetPath);
  const specFiles = globSync(pattern, { absolute: true });

  console.log(`Found ${specFiles.length} test files\n`);

  let migratedCount = 0;
  let errorCount = 0;

  for (const filePath of specFiles) {
    try {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const changed = migrateFile(sourceFile);

      if (changed) {
        sourceFile.saveSync();
        migratedCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error in ${filePath}:`, error);
      errorCount++;
    }
  }

  console.log('\n=====================================');
  console.log(`✅ Migrated: ${migratedCount} files`);
  console.log(
    `⏭️  Skipped: ${specFiles.length - migratedCount - errorCount} files (no changes needed)`,
  );
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files`);
  }
  console.log('=====================================\n');

  if (migratedCount > 0) {
    console.log('🎉 Migration complete! Run your tests to verify:');
    console.log('   nx test sample-app\n');
  }
}

main();
