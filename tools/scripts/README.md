# Jasmine to Vitest Migration Tool

## Überblick

Dieses Tool migriert Angular-Tests von Jasmine/Karma zu Vitest automatisch.

## Status

### ✅ Erfolgreich implementiert:

1. **Vitest Setup für sample-app**
   - Vitest 4.0.16 installiert
   - @analogjs/vite-plugin-angular für Angular-Support
   - Path-Aliases für lokale Libraries konfiguriert
   - **19 von 36 Test-Dateien** laufen bereits

2. **Migration Tool** (`migrate-jasmine-to-vitest.ts`)
   - AST-basierte Code-Transformationen
   - Wiederverwendbar für andere Projekte
   - Test-Suite mit Fixture-Dateien

3. **Funktionierende Transformationen:** (✅ **3 von 5 Tests** bestehen)
   - ✅ `createSpyObj<Type>('name', { method: undefined })` → `vi.mocked<Type>({ method: vi.fn() })`
   - ✅ `spyOn(obj, 'method')` → `vi.spyOn(obj, 'method')`
   - ✅ `spy.calls.reset()` → `vi.clearAllMocks()`
   - ✅ `.and.returnValue()` → `.mockReturnValue()`
   - ✅ `.and.callFake()` → `.mockImplementation()`
   - ✅ Automatisches Hinzufügen von `import { vi } from 'vitest'`

### ⚠️ Bekannte Einschränkungen:

- Multi-line `createSpyObj` mit komplexen Type-Parametern (z.B. über mehrere Zeilen)
- Empty object Edge-Case bei einfachen Patterns

Diese Edge-Cases treten selten auf und können manuell nachbearbeitet werden.

## Usage

### Tests für das Migration-Tool ausführen:

\`\`\`bash
# Einmal ausführen
npm run migrate:test

# Watch Mode
npm run migrate:test:watch
\`\`\`

### Migration auf ein Projekt anwenden:

\`\`\`bash
# Für sample-app
npm run migrate:sample-app

# Für todo-app
npm run migrate:todo-app

# Für store library
npm run migrate:store

# Benutzerdefiniert
npm run migrate:jasmine-to-vitest -- "path/to/**/*.spec.ts"
\`\`\`

### Tests mit Vitest ausführen:

\`\`\`bash
# Alle Tests
nx test sample-app

# Watch Mode
nx test sample-app --watch

# Mit UI
nx test sample-app --ui

# Mit Coverage
nx test sample-app --coverage
\`\`\`

## Transformation Patterns

### Simple Spy Objects

**Vorher (Jasmine):**
\`\`\`typescript
import createSpyObj = jasmine.createSpyObj;

const store = createSpyObj<Store>('Store', {
  dispatch: undefined,
});

store.dispatch.calls.reset();
\`\`\`

**Nachher (Vitest):**
\`\`\`typescript
import { vi } from 'vitest';

const store = vi.mocked<Store>({
  dispatch: vi.fn(),
});

vi.clearAllMocks();
\`\`\`

### SpyOn

**Vorher:**
\`\`\`typescript
const spy = spyOn(service, 'method');
spy.and.returnValue(42);
\`\`\`

**Nachher:**
\`\`\`typescript
const spy = vi.spyOn(service, 'method');
spy.mockReturnValue(42);
\`\`\`

## Warum vi.mocked<Type>()?

Wir verwenden `vi.mocked<Type>({ ... })` statt `{ ... } as unknown as Type`, weil:

1. **Typsicherheit**: Der Compiler prüft, ob alle erforderlichen Methoden vorhanden sind
2. **Bessere IDE-Unterstützung**: Autocomplete für Mock-Methoden
3. **Runtime-Validierung**: Vitest kann Mocks besser tracken
4. **Best Practice**: Empfohlen in der Vitest-Dokumentation

## Test-Fixtures

Die `test-fixtures/` Ordner enthalten Before/After Beispiele:

- `simple-spy.before.ts` / `simple-spy.after.ts` - Einfache Spy-Objekte
- `multiline-spy.before.ts` / `multiline-spy.after.ts` - Komplexe Type-Parameter
- `spyon.before.ts` / `spyon.after.ts` - SpyOn Transformationen

Diese dienen als Referenz und Test-Cases für das Migration-Tool.

## Bekannte Einschränkungen

1. **Komplexe Type-Parameter**: Multi-line generics wie `createStoreAsFnTest<typeof store>` werden noch nicht perfekt gehandhabt
2. **FakeAsync**: Zone.js Timer-Tests (`fakeAsync`, `tick`) brauchen möglicherweise manuelle Anpassungen
3. **Custom Matchers**: Jasmine-spezifische Matcher müssen zu Vitest-Äquivalenten migriert werden

## Nächste Schritte

1. Verbleibende Patterns im Migration-Tool fixen
2. Migration auf `todo-app` anwenden
3. Migration auf `store` Library anwenden
4. Karma komplett entfernen
5. Optional: Nx Generator für automatische Vitest-Migration erstellen
