[![npm](https://img.shields.io/npm/v/@gernsdorfer/ngrx-lite)](https://www.npmjs.com/package/@gernsdorfer/ngrx-lite)
[![npm next](https://img.shields.io/npm/v/@gernsdorfer/ngrx-lite/next?label=next)](https://www.npmjs.com/package/@gernsdorfer/ngrx-lite?activeTab=versions)
[![CI](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/ci.yml/badge.svg)](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@gernsdorfer/ngrx-lite)](https://www.npmjs.com/package/@gernsdorfer/ngrx-lite)

# NgRxLite

> Component-scoped state for Angular that still shows up in the Redux DevTools.

[@ngrx/component-store](https://ngrx.io/guide/component-store) keeps state next to the component that owns it, but
that state lives in its own isolated store — invisible to [@ngrx/store](https://ngrx.io/guide/store) and to the
[Redux DevTools](https://ngrx.io/guide/store-devtools).

NgRxLite bridges the two. You keep the ComponentStore API you already know, and every store registers itself in the
global state tree, so you get action logs, state import, and time travel across routes for free.

**[Documentation](https://gernsdorfer.github.io/ngrx-lite/)** · **[Live demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/)** · **[Sample app source](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app)**

## Why NgRxLite

- **Same API as `@ngrx/component-store`** — plus optional extras, nothing to relearn.
- **Visible in the DevTools** — `setState` and `patchState` become real NgRx actions with custom names, and time travel works across routes.
- **Loading state built in** — effects manage `isLoading`, `item` and `error` for you, no `tapResponse` boilerplate.
- **You pick the scope** — root, a route, or the component, with multiple instances of the same store when you need them.

## Quick start

```bash
npm install @gernsdorfer/ngrx-lite @ngrx/store @ngrx/effects @ngrx/component-store @ngrx/operators @ngrx/store-devtools
```

Provide the NgRx root store once:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [provideStore({}), provideEffects([])],
};
```

Then create a store wherever you need one:

```ts
// counter.component.ts
import { Component, inject, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-counter',
  template: `
    <h2>{{ counterState().counter }}</h2>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent implements OnDestroy {
  private store = inject(StoreFactory).createComponentStore<{ counter: number }>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  // state is a Signal
  public counterState = this.store.state;

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

That's it — the store now appears in the Redux DevTools as `BASIC_COUNTER`.

👉 [Full setup guide](https://gernsdorfer.github.io/ngrx-lite/docs/installation)

## Features

| Feature                                                                                                            | What it does                                                                          |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [Component Store](https://gernsdorfer.github.io/ngrx-lite/docs/api/component-store)                                | `setState` / `patchState` with named actions, effects, and action listeners           |
| [Loading Store](https://gernsdorfer.github.io/ngrx-lite/docs/api/component-loading-store)                          | effects that manage `isLoading`, `item` and `error` — with caching and repeat options |
| [Reactive Loading](https://gernsdorfer.github.io/ngrx-lite/docs/api/component-loading-store#reactiveloadingeffect) | bind a `Signal` source to the loading lifecycle, with automatic request cancellation  |
| [Functional Store](https://gernsdorfer.github.io/ngrx-lite/docs/store-strategies/functional-store)                 | create stores as functions — root or lazy, multiple named instances                   |
| [Form Store](https://gernsdorfer.github.io/ngrx-lite/docs/api/form-store)                                          | two-way sync between a `FormGroup` and your state, for persistence and debugging      |
| [Storage Plugins](https://gernsdorfer.github.io/ngrx-lite/docs/plugins/storage)                                    | keep a store in `sessionStorage` or `localStorage`, or plug in your own               |
| [Router Store](https://gernsdorfer.github.io/ngrx-lite/docs/router-store)                                          | record the URL with each state change and replay it by revisiting the route           |
| [Shared Actions](https://gernsdorfer.github.io/ngrx-lite/docs/store-strategies/combine-with-ngrx-effects)          | react to store changes from a global `@ngrx/effects` effect                           |
| [Testing](https://gernsdorfer.github.io/ngrx-lite/docs/testing)                                                    | `storeTestingFactory()` mocks the redux store in one line                             |

## Compatibility

| ngrx-lite | Angular | NgRx |
| --------- | ------- | ---- |
| 22.x      | 22.x    | 22.x |
| 21.x      | 21.x    | 21.x |

## Contributing

Issues and pull requests are welcome. Run `yarn start` to serve the sample app, `nx test store` for the library
tests, and `nx e2e sample-app-e2e` for the end-to-end suite.

## License

MIT © [Lars Wiedemann](https://github.com/gernsdorfer)
