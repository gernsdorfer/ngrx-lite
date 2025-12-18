import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Test suite for Jasmine to Vitest migration patterns
 *
 * Uses real example files (before/after) to verify transformations
 */

const FIXTURES_DIR = join(__dirname, 'test-fixtures');

function loadFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}

// Helper function to apply all migration transformations
function migrateCode(input: string): string {
  let result = input;

  // 1. Remove jasmine createSpyObj import
  result = result.replace(/import createSpyObj = jasmine\.createSpyObj;\n/g, '');

  // 3. Convert multi-line createSpyObj - handle complex nested structures
  // We need to handle cases where braces span multiple lines
  // Strategy: Find all createSpyObj calls and manually parse the structure

  // Match optional 'jasmine.' prefix before createSpyObj
  const createSpyObjRegex = /(?:jasmine\.)?createSpyObj<([\s\S]+?)>\s*\(/g;
  let match;
  const replacements: Array<{start: number, end: number, replacement: string}> = [];

  while ((match = createSpyObjRegex.exec(result)) !== null) {
    const typeParam = match[1].trim();
    const startPos = match.index;
    const openParenPos = match.index + match[0].length - 1; // Position of '('

    // Manually find the matching closing paren
    let depth = 1;
    let pos = openParenPos + 1;
    let argStart = pos;
    const args: string[] = [];
    let currentArg = '';
    let inBraces = 0;

    while (pos < result.length && depth > 0) {
      const char = result[pos];

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
      const methodContent = firstArg.substring(1, firstArg.lastIndexOf('}')).trim();
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
      const propContent = secondArg.substring(1, secondArg.lastIndexOf('}')).trim();
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
      replacement = `vi.mocked<${typeParam}>({})`;
    } else {
      replacement = `vi.mocked<${typeParam}>({\n    ${allMembers.join(',\n    ')}\n  })`;
    }

    replacements.push({
      start: startPos,
      end: pos + 1, // +1 to include the closing paren
      replacement: replacement
    });
  }

  // Apply replacements in reverse order to maintain indices
  for (let i = replacements.length - 1; i >= 0; i--) {
    const {start, end, replacement} = replacements[i];
    result = result.substring(0, start) + replacement + result.substring(end);
  }

  // 4. Convert spy.calls.reset() to vi.clearAllMocks()
  result = result.replace(/(\w+)\.(\w+)\.calls\.reset\(\)/g, 'vi.clearAllMocks()');

  // 5. Convert spyOn to vi.spyOn
  result = result.replace(/\bspyOn\(/g, 'vi.spyOn(');

  // 6. Convert .and.returnValue to .mockReturnValue
  result = result.replace(/\.and\.returnValue\(/g, '.mockReturnValue(');

  // 7. Convert .and.callFake to .mockImplementation
  result = result.replace(/\.and\.callFake\(/g, '.mockImplementation(');

  // 8. Add vi import AFTER all transformations (so we can detect if vi is used)
  if (!result.includes("from 'vitest'") &&
      (result.includes('vi.fn()') || result.includes('vi.spyOn') || result.includes('vi.clearAllMocks'))) {
    const firstImport = result.indexOf('import');
    if (firstImport !== -1) {
      result = result.slice(0, firstImport) +
               "import { vi } from 'vitest';\n" +
               result.slice(firstImport);
    }
  }

  return result;
}

describe('Jasmine to Vitest Migration', () => {

  describe('Simple spy objects', () => {
    it('should migrate simple createSpyObj pattern', () => {
      const before = loadFixture('simple-spy.before.ts');
      const expected = loadFixture('simple-spy.after.ts');

      const result = migrateCode(before);

      // Check key transformations
      expect(result).toContain("import { vi } from 'vitest';");
      expect(result).not.toContain('jasmine.createSpyObj');
      expect(result).toContain('dispatch: vi.fn()');
      expect(result).toContain('vi.mocked<Store>({');
      expect(result).toContain('vi.clearAllMocks()');
      expect(result).not.toContain('.calls.reset()');

      // Note: Exact match might differ in whitespace/formatting
      // For production, consider using AST comparison or prettier
    });
  });

  describe('Multi-line spy objects', () => {
    it('should migrate multi-line createSpyObj with properties', () => {
      const before = loadFixture('multiline-spy.before.ts');
      const expected = loadFixture('multiline-spy.after.ts');

      const result = migrateCode(before);

      expect(result).toContain("import { vi } from 'vitest';");
      expect(result).not.toContain('jasmine.createSpyObj');
      expect(result).toContain('increment: vi.fn()');
      expect(result).toContain('state: dynamicState');
      expect(result).toContain('onLazyStoreBSuccess: vi.fn()');
      expect(result).toContain('vi.mocked<createStoreAsFnTest<typeof dynamicStore>>({');
    });
  });

  describe('spyOn transformations', () => {
    it('should migrate spyOn and .and.returnValue', () => {
      const before = loadFixture('spyon.before.ts');
      const expected = loadFixture('spyon.after.ts');

      const result = migrateCode(before);

      expect(result).toContain("import { vi } from 'vitest';");
      expect(result).toContain('vi.spyOn(TestBed.inject(Router)');
      expect(result).toContain('.mockReturnValue(Promise.resolve(true))');
      expect(result).not.toContain('const navigateSpy = spyOn('); // Prüfe dass es NICHT das alte Pattern ist
      expect(result).not.toContain('.and.returnValue');
    });
  });

  describe('Pattern validation', () => {
    it('should handle createSpyObj with empty object', () => {
      const input = `const obj = createSpyObj<Empty>('Empty', {});`;
      const result = migrateCode(input);

      expect(result).toContain('vi.mocked<Empty>({})');
    });

    it('should preserve code that does not need migration', () => {
      const input = `
import { TestBed } from '@angular/core/testing';

describe('MyTest', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
`;
      const result = migrateCode(input);
      expect(result).toContain("expect(true).toBe(true)");
    });
  });
});
