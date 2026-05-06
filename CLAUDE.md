# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Nx monorepo (yarn workspaces, package manager = yarn per `nx.json`). Default base branch is `master`.

- `libs/store` — the published library `@gernsdorfer/ngrx-lite`. This is the only deliverable; everything else is demo/docs.
- `libs/store/testing` — secondary entry point exporting `storeTestingFactory()` (used as `@gernsdorfer/ngrx-lite/testing`).
- `apps/sample-app` — demo app, also bundled into the docs site. Run via `yarn start`.
- `apps/sample-app-e2e` — Cypress e2e for sample-app.
- `apps/doc-app` — docs site (yarn workspace; see `package.json#workspaces`).
- `apps/todo-app` — secondary demo.
- `testing/vitest-helpers.ts` — workspace-wide vitest helper exposed as `@ngrx-lite/testing` (see `tsconfig.base.json` paths).

## Common commands

```bash
yarn start                          # serve sample-app
yarn test                           # nx test (default project = ngrx-lite — usually run a target instead)
yarn build:release                  # production build of libs/store → dist/libs/store
yarn build:docs                     # build doc-app + sample-app under /ngrx-lite/sample-app/
yarn format:check / yarn format     # prettier via nx
yarn affected:{build,lint,test,e2e} # CI uses these against master

nx test store                       # unit tests for the library (vitest)
nx test sample-app                  # unit tests for sample-app (vitest)
nx lint store                       # eslint a single project
nx build store                      # ng-packagr build of the library
nx serve sample-app                 # same as `yarn start`
nx e2e sample-app-e2e               # Cypress e2e
```

Run a single test file/test name (vitest):

```bash
npx nx test store -- src/services/store.service.spec.ts
npx nx test store -- -t "patches state"     # run by test name
```

## Architecture

The library wraps `@ngrx/component-store` so that each component-scoped store also appears in the global `@ngrx/store` and Redux DevTools. Understanding this bridge is essential before changing anything in `libs/store/src/services/`.

### Creation flow

`StoreFactory` (`services/store-factory.service.ts`, `providedIn: 'root'`) is the only public entry point. Three factory methods — `createComponentStore`, `createComponentLoadingStore`, `createFormComponentStore` — all delegate to `Store.createStoreByStoreType` (`services/store.service.ts`).

`createStoreByStoreType` does five things:

1. Resolves the optional `DynamicStoreName` token from the **calling injector** (`inject(DynamicStoreName, { self: true })`) and combines it with `storeName` via `getFullStoreName` — that's how the same store class can be instantiated multiple times under distinct keys.
2. Reads the initial state from the matching storage plugin (`sessionStoragePlugin` / `localStoragePlugin`) if the consumer opted in, otherwise uses the provided `defaultState`.
3. Creates an isolated `Injector.create({...})` so each store gets its own `DevToolHelper`/`Actions`/`NgrxStore` plus per-store tokens (`StoreNameToken`, `StateToken`, `SkipLogForStore`). The store class itself is a regular `NgrxComponentStore` subclass.
4. Registers a reducer with `ReducerManager.addReducer(storeName, …)` that only responds to actions whose type starts with `[COMPONENT_STORE][<storeName>]` (see `getActionReducer` and `isActionTypeForCurrentStore`). This is what makes the local state visible in the global `@ngrx/store` tree.
5. Wires three subscriptions, all gated by `store.destroy$`: state → storage plugin, DevTools `liftedState` → `setState({ forced: true, skipLog: true })` (powers time-travel), and `destroy$` → `ReducerManager.removeReducer` once no lifted actions reference the store anymore.

### Action naming and time travel

Custom actions are produced by `getCustomAction` in `services/action-creator.ts` with type `[COMPONENT_STORE][<storeName>] <actionName>`. `ComponentStore.setState`/`patchState` (in `services/stores/component-store.service.ts`) call `super.setState`/`patchState` synchronously and then schedule the dispatch on `asapScheduler` so the local update lands first.

Time travel is detected in `Store.checkForTimeTravel` by comparing `currentStateIndex` to `stagedActionIds.length - 1` on `StoreDevtools.liftedState`; when active, the flag in `DevToolHelper` causes `setState`/`patchState` to bail out (unless `forced: true`, which the DevTools sync uses) so the user's normal mutations don't fight time-travel replay.

### Import-state support

`Store.addReducersForImportState` listens for `monitorState.type === 'IMPORT_STATE'`, extracts every store name embedded in the imported actions' types, and registers a no-op-initial-state reducer for any store that isn't currently mounted. That's why `StoreDevtoolsModule.instrument({ monitor: (state, action) => action })` is required in consuming apps.

### Loading store

`ComponentLoadingStore` (`services/stores/component-loading-store.service.ts`) extends `ComponentStore` with `loadingEffect(name, fn)`. Its state is `LoadingStoreState<ITEM, ERROR> = { isLoading; item?; error? }`; `getDefaultComponentLoadingState` seeds it. The effect manages `isLoading`/`item`/`error` automatically.

### Form store

`createFormComponentStore` is a normal `ComponentStore` plus two-way sync between an Angular `FormGroup` and the store, with a `JSON.stringify` equality guard to break the loop. State changes log a `Form_CHANGED` action.

### Router store (separate module)

`RouterStoreModule` (`router-store/`) is opt-in. It records URLs alongside store actions so DevTools time-travel can replay state per route. Excluded from coverage in `vitest.config.ts`.

## Testing

- Runner: **Vitest** via `@analogjs/vite-plugin-angular`. Per-project config at `<project>/vitest.config.ts`. `karma.conf.js` exists in the repo root but is not used by the live `test` targets.
- `libs/store` enforces **100% line/branch/function/statement coverage** (`vitest.config.ts` thresholds). Coverage exclusions are listed there — notably `router-store/**` and `models/**`.
- Tests for consumers should import `storeTestingFactory()` from `@gernsdorfer/ngrx-lite/testing` (provides `provideMockStore`, `provideMockActions(actions$)`, and `StoreFactory`). The exported `actions$` `Subject` is how tests dispatch into effects.
- For Vitest mocks use `createVitestSpyObj` from `@ngrx-lite/testing` (`testing/vitest-helpers.ts`), not Jasmine spy objects, despite `jasmine-marbles` being a devDependency.
- Test bootstrap is `libs/store/src/test-setup.ts` — it initializes the `BrowserTestingModule` test environment; don't re-initialize TestBed in specs.

## Conventions worth knowing

- Path aliases live in `tsconfig.base.json`: `@gernsdorfer/ngrx-lite`, `@gernsdorfer/ngrx-lite/testing`, `@ngrx-lite/testing`. Use these instead of relative paths across project boundaries — `@nx/enforce-module-boundaries` is on.
- Action type prefix `[COMPONENT_STORE][<storeName>]` is load-bearing (see `isActionTypeForCurrentStore`, `addReducersForImportState`). Don't change the format without updating both call sites.
- New stores added to `libs/store` need fixture coverage to keep the 100% gate green; if something is intentionally untestable, add it to the coverage `exclude` list with a justification.
- `nxCloudAccessToken` in `nx.json` is a read-write token committed intentionally — don't replace or strip it.

## Agent skills

### Issue tracker

GitHub Issues at `github.com/gernsdorfer/ngrx-lite`, accessed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
