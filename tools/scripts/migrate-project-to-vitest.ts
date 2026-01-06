#!/usr/bin/env ts-node
/**
 * Migration script: Migrate NX Project to Vitest
 *
 * Prerequisites:
 * - ts-morph and glob are required (included in package.json devDependencies)
 *
 * This script prepares an NX project for Vitest migration by:
 * 0. Installing Vitest, jsdom, and platform-specific esbuild packages
 * 1. Renaming test.ts to test-setup.ts
 * 2. Updating tsconfig.spec.json (types: jasmine → vitest/globals)
 * 3. Removing karma.conf.js
 * 4. Updating project.json test target to use Vitest
 * 5. Running the Angular schematic: nx g @schematics/angular:refactor-jasmine-vitest --project <project>
 * 5a. Creating vitest.config.ts
 * 5b. Updating test-setup.ts for Vitest (beforeAll/afterEach hooks)
 * 5c. Cleaning up tsconfig.json (removing non-existent references)
 * 6. Migrating Jasmine spy code to Vitest
 * 7. Fixing signal mocking issues (removing vi.fn() for signal properties)
 *
 * Usage:
 *   npm run migrate:project -- sample-app
 *   npm run migrate:project -- store
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join, relative } from 'path';
import { Project, SourceFile } from 'ts-morph';

const PROJECT_ROOT = process.cwd();

interface ProjectConfig {
  name: string;
  projectType: 'application' | 'library';
  sourceRoot: string;
  prefix?: string;
  targets: {
    test?: {
      executor: string;
      outputs?: string[];
      options?: any;
    };
    [key: string]: any;
  };
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warn: '⚠️'
  };
  console.log(`${icons[type]} ${message}`);
}

function findProjectPath(projectName: string): string | null {
  const possiblePaths = [
    join(PROJECT_ROOT, 'apps', projectName),
    join(PROJECT_ROOT, 'libs', projectName),
  ];

  for (const path of possiblePaths) {
    if (existsSync(join(path, 'project.json'))) {
      return path;
    }
  }

  return null;
}

function readProjectConfig(projectPath: string): ProjectConfig {
  const configPath = join(projectPath, 'project.json');
  const content = readFileSync(configPath, 'utf-8');
  return JSON.parse(content);
}

function writeProjectConfig(projectPath: string, config: ProjectConfig) {
  const configPath = join(projectPath, 'project.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
}

function renameTestSetup(projectPath: string, config: ProjectConfig) {
  const testTsPath = join(projectPath, 'src', 'test.ts');
  const testSetupPath = join(projectPath, 'src', 'test-setup.ts');

  if (!existsSync(testTsPath)) {
    if (existsSync(testSetupPath)) {
      log('test-setup.ts already exists', 'success');
    } else {
      log('test.ts not found, skipping rename', 'warn');
    }
    return;
  }

  if (existsSync(testSetupPath)) {
    log('test-setup.ts already exists, removing old test.ts', 'warn');
    unlinkSync(testTsPath);
    return;
  }

  renameSync(testTsPath, testSetupPath);
  log('Renamed test.ts → test-setup.ts', 'success');
}

function createVitestConfig(projectPath: string, config: ProjectConfig) {
  const vitestConfigPath = join(projectPath, 'vitest.config.ts');

  if (existsSync(vitestConfigPath)) {
    log('vitest.config.ts already exists', 'success');
    return;
  }

  const relativeRoot = relative(projectPath, PROJECT_ROOT);
  const projectRelativePath = relative(PROJECT_ROOT, projectPath);

  const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '${relativeRoot}/coverage/${projectRelativePath}',
    },
  },
});
`;

  writeFileSync(vitestConfigPath, vitestConfig);
  log('Created vitest.config.ts', 'success');
}

function updateTestSetupForVitest(projectPath: string) {
  const testSetupPath = join(projectPath, 'src', 'test-setup.ts');

  if (!existsSync(testSetupPath)) {
    log('test-setup.ts not found, skipping update', 'warn');
    return;
  }

  let content = readFileSync(testSetupPath, 'utf-8');

  // Update the initialization code for Vitest
  if (content.includes('getTestBed().initTestEnvironment') && !content.includes('try {')) {
    // Add vitest imports if not present (do this BEFORE replacing content)
    if (!content.includes('import { afterEach }') && !content.includes('from \'vitest\'')) {
      // Check if BrowserDynamicTestingModule import already exists
      const hasBrowserImport = content.includes('BrowserDynamicTestingModule');

      if (hasBrowserImport) {
        // Just add vitest imports after the existing imports
        content = content.replace(
          /@angular\/platform-browser-dynamic\/testing';/,
          `@angular/platform-browser-dynamic/testing';\nimport { afterEach } from 'vitest';`
        );
      } else {
        // Add both imports
        content = content.replace(
          /import { getTestBed } from '@angular\/core\/testing';/,
          `import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { afterEach } from 'vitest';`
        );
      }
    }

    // Replace the direct initTestEnvironment call with try-catch and afterEach
    content = content.replace(
      /\/\/ First, initialize the Angular testing environment\.\ngetTestBed\(\)\.initTestEnvironment\(\s*BrowserDynamicTestingModule,\s*platformBrowserDynamicTesting\(\),?\s*\);/,
      `// First, initialize the Angular testing environment.
// This runs once when the file is imported (globally for all tests)
try {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
  );
} catch (e) {
  // Platform already initialized, this is fine for Vitest
  // which runs all tests in the same process
}

// Reset test environment after each test
afterEach(() => {
  getTestBed().resetTestingModule();
});`
    );

    // Update comment at top
    content = content.replace(
      /\/\/ This file is required by karma\.conf\.js/,
      '// This file is required by vitest'
    );

    writeFileSync(testSetupPath, content);
    log('Updated test-setup.ts for Vitest compatibility', 'success');
  }

  // Check if helper already exists
  if (content.includes('createVitestSpyObj')) {
    log('createVitestSpyObj helper already exists', 'success');
    return;
  }

  // Add the helper function at the end of the file
  const helperCode = `
// Vitest helper to mimic Jasmine's createSpyObj
import type { MockInstance } from 'vitest';

type Mockify<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockInstance<T[K]>
    : T[K];
};

export function createVitestSpyObj<T extends object>(
  impl: Partial<T>,
): any {
  return impl;
}
`;

  const updatedContent = content + helperCode;
  writeFileSync(testSetupPath, updatedContent);
  log('Added createVitestSpyObj helper to test-setup.ts', 'success');
}

function updateTsConfigSpec(projectPath: string) {
  const tsConfigPath = join(projectPath, 'tsconfig.spec.json');

  if (!existsSync(tsConfigPath)) {
    log('tsconfig.spec.json not found, skipping', 'warn');
    return;
  }

  const content = readFileSync(tsConfigPath, 'utf-8');
  const tsConfig = JSON.parse(content);

  // Update types from jasmine to vitest/globals
  if (tsConfig.compilerOptions?.types) {
    const types = tsConfig.compilerOptions.types;
    const jasmineIndex = types.indexOf('jasmine');

    if (jasmineIndex !== -1) {
      types.splice(jasmineIndex, 1);
      if (!types.includes('vitest/globals')) {
        types.push('vitest/globals');
      }
      log('Updated types: jasmine → vitest/globals', 'success');
    } else if (!types.includes('vitest/globals')) {
      types.push('vitest/globals');
      log('Added vitest/globals to types', 'success');
    } else {
      log('vitest/globals already in types', 'success');
    }
  } else {
    tsConfig.compilerOptions = tsConfig.compilerOptions || {};
    tsConfig.compilerOptions.types = ['vitest/globals', 'node'];
    log('Added types to tsconfig.spec.json', 'success');
  }

  // Remove test.ts from files array if present
  if (tsConfig.files) {
    const testTsIndex = tsConfig.files.indexOf('src/test.ts');
    if (testTsIndex !== -1) {
      tsConfig.files.splice(testTsIndex, 1);
      log('Removed src/test.ts from files array', 'success');
    }
  }

  writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2) + '\n');
}

function removeKarmaConfig(projectPath: string) {
  const karmaConfigPath = join(projectPath, 'karma.conf.js');

  if (!existsSync(karmaConfigPath)) {
    log('karma.conf.js not found (already removed)', 'success');
    return;
  }

  unlinkSync(karmaConfigPath);
  log('Removed karma.conf.js', 'success');
}

function updateProjectJson(projectPath: string, config: ProjectConfig) {
  if (!config.targets.test) {
    log('No test target found in project.json', 'warn');
    return;
  }

  const oldExecutor = config.targets.test.executor;

  if (oldExecutor === '@angular/build:unit-test' || oldExecutor === '@nx/vitest:test' || oldExecutor === '@analogjs/vitest:test') {
    log('Test target already uses Vitest executor', 'success');
    return;
  }

  // Update test target to use Angular's official Vitest builder
  config.targets.test = {
    executor: '@angular/build:unit-test',
    outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
    options: {},
  };

  writeProjectConfig(projectPath, config);
  log(`Updated test target: ${oldExecutor} → @angular/build:unit-test`, 'success');
}

function runAngularSchematic(projectName: string) {
  log('Running Angular schematic: @schematics/angular:refactor-jasmine-vitest');

  try {
    execSync(
      `npx nx g @schematics/angular:refactor-jasmine-vitest --project=${projectName}`,
      {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
      }
    );
    log('Angular schematic completed', 'success');
  } catch (error) {
    log('Angular schematic failed or was cancelled', 'error');
    throw error;
  }
}

function migrateTestFile(sourceFile: SourceFile): boolean {
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

  // 3b. Add createVitestSpyObj import from test-setup if createSpyObj is used
  if (hasJasmineSpyObj) {
    const hasHelperImport = sourceFile
      .getImportDeclarations()
      .some((imp) => {
        const specifier = imp.getModuleSpecifierValue();
        return specifier.includes('test-setup') &&
               imp.getNamedImports().some(ni => ni.getName() === 'createVitestSpyObj');
      });

    if (!hasHelperImport) {
      // Calculate relative path from spec file to test-setup.ts
      const specFilePath = sourceFile.getFilePath();
      const specDir = specFilePath.substring(0, specFilePath.lastIndexOf('/'));
      const testSetupPath = specFilePath.substring(0, specFilePath.indexOf('/src/') + 4) + '/test-setup';

      // Calculate relative path
      let relativePath = relative(specDir, testSetupPath);
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }
      // Remove .ts extension if present
      relativePath = relativePath.replace(/\.ts$/, '');

      sourceFile.addImportDeclaration({
        moduleSpecifier: relativePath,
        namedImports: ['createVitestSpyObj'],
      });
      hasChanges = true;
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
      replacement = `createVitestSpyObj<${typeParam}>({})`;
    } else {
      replacement = `createVitestSpyObj<${typeParam}>({\n    ${allMembers.join(',\n    ')}\n  })`;
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

function fixSignalMocks(config: ProjectConfig) {
  log('Fixing potential signal mocking issues...');

  const pattern = join(PROJECT_ROOT, config.sourceRoot, '**/*.spec.ts');
  const specFiles = globSync(pattern, { absolute: true });

  let fixedCount = 0;
  const filesWithIssues: string[] = [];

  for (const filePath of specFiles) {
    let content = readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Replace common signal property names that are mocked with vi.fn()
    // with actual signal instances
    const replacements = [
      { pattern: /\bsignal:\s*vi\.fn\(\)/g, replacement: 'signal: signal({ value: null })', name: 'signal' },
      { pattern: /\bvalue:\s*vi\.fn\(\)/g, replacement: 'value: signal(null)', name: 'value' },
      { pattern: /\bdata:\s*vi\.fn\(\)/g, replacement: 'data: signal(null)', name: 'data' },
    ];

    for (const { pattern, replacement } of replacements) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
      }
    }

    // Ensure signal is imported from @angular/core if we made replacements
    if (hasChanges) {
      if (!content.includes('import') || !content.includes('signal')) {
        // Add signal to existing @angular/core import if present
        if (content.includes('from \'@angular/core\'')) {
          content = content.replace(
            /import\s*{([^}]+)}\s*from\s*'@angular\/core';/,
            (match, imports) => {
              if (!imports.includes('signal')) {
                return `import {${imports}, signal } from '@angular/core';`;
              }
              return match;
            }
          );
        } else {
          // No @angular/core import found, add it after the first import
          const firstImportMatch = content.match(/import[^;]+;/);
          if (firstImportMatch) {
            const firstImport = firstImportMatch[0];
            content = content.replace(
              firstImport,
              `${firstImport}\nimport { signal } from '@angular/core';`
            );
          }
        }
      }

      writeFileSync(filePath, content);
      fixedCount++;
      filesWithIssues.push(relative(PROJECT_ROOT, filePath));
    }
  }

  if (fixedCount > 0) {
    console.log(`\n  Fixed signal mocking in ${fixedCount} files:`);
    for (const file of filesWithIssues) {
      console.log(`  ✓ ${file}`);
    }
    log(`Replaced vi.fn() with signal() for signal properties`, 'success');
  } else {
    log('No signal mocking issues to fix', 'success');
  }
}

function migrateJasmineCode(config: ProjectConfig) {
  log('Migrating Jasmine spy code to Vitest...');

  const project = new Project({
    tsConfigFilePath: join(PROJECT_ROOT, 'tsconfig.base.json'),
  });

  // Find all spec files in the project
  const pattern = join(PROJECT_ROOT, config.sourceRoot, '**/*.spec.ts');
  const specFiles = globSync(pattern, { absolute: true });

  console.log(`  Found ${specFiles.length} test files\n`);

  let migratedCount = 0;
  let errorCount = 0;

  for (const filePath of specFiles) {
    try {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const changed = migrateTestFile(sourceFile);

      if (changed) {
        sourceFile.saveSync();
        migratedCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error in ${filePath}:`, error);
      errorCount++;
    }
  }

  console.log('');
  log(`Migrated ${migratedCount} files`, 'success');
  log(`Skipped ${specFiles.length - migratedCount - errorCount} files (no changes needed)`, 'info');
  if (errorCount > 0) {
    log(`Errors: ${errorCount} files`, 'error');
  }
}

function installVitest() {
  log('Installing Vitest with Nx...');

  try {
    execSync('npx nx add @nx/vitest', {
      stdio: 'inherit',
      cwd: PROJECT_ROOT
    });
    log('Vitest installed successfully', 'success');
  } catch (error) {
    log('Failed to install Vitest (may already be installed)', 'warn');
  }
}

function installJsdom() {
  log('Installing jsdom and esbuild platform package...');

  try {
    // Install jsdom and the correct esbuild platform package
    // Note: @esbuild/darwin-arm64 is for Apple Silicon Macs
    // For other platforms, npm will install the correct one automatically
    execSync('npm install --save-dev jsdom --legacy-peer-deps', {
      stdio: 'inherit',
      cwd: PROJECT_ROOT
    });

    // Explicitly install esbuild platform package to avoid issues with --legacy-peer-deps
    const platform = process.platform;
    const arch = process.arch;
    let esbuildPackage = '';

    if (platform === 'darwin' && arch === 'arm64') {
      esbuildPackage = '@esbuild/darwin-arm64';
    } else if (platform === 'darwin' && arch === 'x64') {
      esbuildPackage = '@esbuild/darwin-x64';
    } else if (platform === 'linux' && arch === 'x64') {
      esbuildPackage = '@esbuild/linux-x64';
    } else if (platform === 'linux' && arch === 'arm64') {
      esbuildPackage = '@esbuild/linux-arm64';
    } else if (platform === 'win32' && arch === 'x64') {
      esbuildPackage = '@esbuild/win32-x64';
    }

    if (esbuildPackage) {
      execSync(`npm install --save-dev ${esbuildPackage} --legacy-peer-deps`, {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
      });
      log(`Installed ${esbuildPackage} successfully`, 'success');
    }

    log('jsdom and esbuild installed successfully', 'success');
  } catch (error) {
    log('Failed to install jsdom or esbuild', 'error');
    throw error;
  }
}

function cleanupTsConfig(projectPath: string) {
  const tsConfigPath = join(projectPath, 'tsconfig.json');

  if (!existsSync(tsConfigPath)) {
    log('tsconfig.json not found, skipping cleanup', 'warn');
    return;
  }

  const content = readFileSync(tsConfigPath, 'utf-8');
  const tsConfig = JSON.parse(content);

  let hasChanges = false;

  // Remove tsconfig.editor.json reference if it doesn't exist
  if (tsConfig.references) {
    const editorConfigPath = join(projectPath, 'tsconfig.editor.json');
    const editorRefIndex = tsConfig.references.findIndex(
      (ref: any) => ref.path === './tsconfig.editor.json'
    );

    if (editorRefIndex !== -1 && !existsSync(editorConfigPath)) {
      tsConfig.references.splice(editorRefIndex, 1);
      hasChanges = true;
      log('Removed tsconfig.editor.json reference (file does not exist)', 'success');
    }
  }

  if (hasChanges) {
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2) + '\n');
  } else {
    log('No tsconfig.json cleanup needed', 'success');
  }
}

function migrateProject(projectName: string) {
  console.log('\n🔄 Vitest Project Migration');
  console.log('='.repeat(60));
  console.log(`Project: ${projectName}\n`);

  // 0. Install dependencies
  console.log('--- Step 0: Install Vitest, jsdom, and esbuild ---');
  installVitest();
  installJsdom();

  // 1. Find project
  const projectPath = findProjectPath(projectName);
  if (!projectPath) {
    log(`Project "${projectName}" not found in apps/ or libs/`, 'error');
    process.exit(1);
  }
  log(`Found project at: ${relative(PROJECT_ROOT, projectPath)}`);

  // 2. Read project config
  const config = readProjectConfig(projectPath);
  log(`Project type: ${config.projectType}`);

  console.log('\n--- Step 1: Rename test.ts → test-setup.ts ---');
  renameTestSetup(projectPath, config);

  console.log('\n--- Step 2: Update tsconfig.spec.json ---');
  updateTsConfigSpec(projectPath);

  console.log('\n--- Step 3: Remove karma.conf.js ---');
  removeKarmaConfig(projectPath);

  console.log('\n--- Step 4: Update project.json test target ---');
  updateProjectJson(projectPath, config);

  console.log('\n--- Step 5: Run Angular schematic ---');
  runAngularSchematic(projectName);

  console.log('\n--- Step 5a: Create vitest.config.ts ---');
  createVitestConfig(projectPath, config);

  console.log('\n--- Step 5b: Update test-setup.ts for Vitest ---');
  updateTestSetupForVitest(projectPath);

  console.log('\n--- Step 5c: Cleanup tsconfig.json ---');
  cleanupTsConfig(projectPath);

  console.log('\n--- Step 6: Migrate Jasmine spy code to Vitest ---');
  migrateJasmineCode(config);

  console.log('\n--- Step 7: Fix signal mocking issues ---');
  fixSignalMocks(config);

  console.log('\n' + '='.repeat(60));
  log('Migration complete!', 'success');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log(`  1. Review generated vitest.config.ts and test-setup.ts`);
  console.log(`  2. Test: nx test ${projectName}`);
  console.log(`  3. If tests still fail, check if any signals need manual mocking`);
  console.log('');
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run migrate:project -- <project-name>');
    console.error('\nExamples:');
    console.error('  npm run migrate:project -- sample-app');
    console.error('  npm run migrate:project -- store');
    console.error('  npm run migrate:project -- todo-app');
    process.exit(1);
  }

  const projectName = args[0];
  migrateProject(projectName);
}

main();
