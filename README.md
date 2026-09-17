[![Test, Lint, Build](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/ci.yml/badge.svg)]()
[![Publish to NPM](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml)
[![styled with](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![ngrx-lite](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/hjc4hp/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/hjc4hp/runs)

# NgRxLite

> A small Angular state management based on [NgRx](https://github.com/ngrx/platform) ComponentStore, with some benefits 😎

## Synopsis

The current [@ngrx/component-store](https://ngrx.io/guide/component-store) implementation works with its own isolated
store. Unfortunately, there is no connection to the global [@ngrx/store](https://ngrx.io/guide/store) or
the [@ngrx/store-devtools](https://ngrx.io/guide/store-devtools).

This library connects your [@ngrx/component-store](https://ngrx.io/guide/component-store) with
the [@ngrx/store](https://ngrx.io/guide/store) to share and debug
the [@ngrx/actions](https://ngrx.io/guide/store/actions) and store.

## Benefits

- 🤝 same API as [@ngrx/component-store](https://ngrx.io/guide/component-store) with optional parameters
- ⏱ fast and easy creation of a dynamic Redux store
- ⏳ optional integrated loading state for effects
- 🤯 debugging of application state across different routes
- ⚒️ Redux DevTools support for NgRxLite ComponentStores for
  - `patchState`
  - `setState`
  - `loadingEffect`
- 💽 supports session storage and local storage
- 🏘 freedom to decide where the store is located: root, a scope, or the component
- 🔛 share the state changes and actions in the NgRx store
- 📑 store the form data for persistence and debugging
- 👂 create effects for global storage
- 🚦 signal-driven loading with `reactiveLoadingEffect`, `autoLoad` and `skipWhen`
- ✍️ writing tests is much easier

<hr />

- 👩‍💻 checkout the [sample app](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/)
- ▶️ Play with a [Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/)
- 📖 read the [docs](http://gernsdorfer.github.io/ngrx-lite/)

## Version compatibility

| ngrx-lite | Angular | NgRx |
| --------- | ------- | ---- |
| 22.x      | 22.x    | 22.x |
| 21.x      | 21.x    | 21.x |

## Install

### Yarn

```bash
yarn add @gernsdorfer/ngrx-lite @ngrx/store @ngrx/effects @ngrx/component-store @ngrx/operators @ngrx/store-devtools
```

### NPM

```bash
npm install @gernsdorfer/ngrx-lite @ngrx/store @ngrx/effects @ngrx/component-store @ngrx/operators @ngrx/store-devtools
```

## Usage

1. provide the [NgRx](https://github.com/ngrx/platform) store in your `ApplicationConfig`

```ts title="app.config.ts"
import { ApplicationConfig } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [provideStore({}), provideEffects([])],
};
```

2. create the store with the same API as [@ngrx/component-store](https://ngrx.io/guide/component-store)

```ts
import { Component, inject, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-component',
  template: `
    <h2>{{ counterState().counter }}</h2>
    <button (click)="increment(counterState().counter + 1)">+</button>
  `,
})
class MyComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  // create a componentStore
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  // read the state — state is a Signal
  public counterState = this.store.state;

  increment(counter: number) {
    // patch your state
    this.store.patchState({ counter });
  }

  ngOnDestroy() {
    // destroy the store
    this.store.ngOnDestroy();
  }
}
```

That's it 🥳

## Features

### DevTools support

Install and register [ngrx/store-devtools](https://ngrx.io/guide/store-devtools) and have all the features of the
DevTools for your component store.

It's important to set the `monitor` property in your `StoreDevtoolsOptions`, otherwise a state import is not possible.

```ts title="app.config.ts"
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({}),
    provideStoreDevtools({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      // set the monitor property here
      monitor: (state, action) => action,
    }),
  ],
};
```

Let's take a look at Redux DevTools and what happens in the example above.

#### Store is initialized

After the store is initialized you can find the store in the `@ngrx/devtools`.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/component-store-devtools-init.png)

#### Patch state

After patching the state you see this in your Redux DevTools. It's possible to define a custom action name for your
patch/set state.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/component-store-devtools-patch.png)

### Router store

Register the `RouterStoreModule` in your application to debug your state across all visited URLs. This module
stores related URLs with the current store.

So it's possible to replay your state changes by revisiting the related url.

```ts title="app.config.ts"
import { importProvidersFrom } from '@angular/core';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';

export const appConfig: ApplicationConfig = {
  providers: [provideStore({}), importProvidersFrom(RouterStoreModule)],
};
```

### Loading store

Create a `ComponentLoadingStore` to set a loading state while an effect is running. You have the same API
as `createComponentStore` plus `loadingEffect`.

```ts
import { Component, inject, OnDestroy } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

type State = LoadingStoreState<{ counter: number }, { message: string }>;

@Component({
  selector: 'my-app-loading-effect',
  templateUrl: 'loading-effect.html',
})
export class LoadingEffectComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  // create your loading store
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });

  // read the state
  public counterState = this.store.state;

  // define your loadingEffect to change the state
  public increment = this.store.loadingEffect('increment', (counter: number) => of({ counter: counter + 1 }));

  ngOnDestroy() {
    // destroy the store
    this.store.ngOnDestroy();
  }
}
```

Let's take a look at Redux DevTools and what happens in the example above.

#### Store is initialized

After the store is initialized you can find the store in the `@ngrx/devtools`.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/init.png)

#### Loader state `isLoading` changed

For a running effect `isLoading` is true and you can show a spinner in your UI.

![State-Loading](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/load.png)

#### Effect successfully executed

After an effect was successfully executed the `item` key is updated.

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/success.png)

#### Effect unsuccessfully executed

After an effect was unsuccessfully executed the `error` key contains the error.

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/error.png)

#### Load once on start — `autoLoad`

For parameter-free effects, `autoLoad` triggers the loader once after the store is created, so you don't need a
manual `effect()` block in your component.

```ts
public reload = this.store.loadingEffect('LOAD_CONFIG', () => this.api.getConfig(), {
  autoLoad: true,
});
```

#### Skip a run — `skipWhen`

`skipWhen` is evaluated before every run and suppresses the dispatch when it returns `true` — useful for cache hits,
feature flags, or skipping the client re-fetch after SSR hydration.

```ts
public reload = this.store.loadingEffect('LOAD_CONFIG', () => this.api.getConfig(), {
  autoLoad: true,
  skipWhen: () => this.transferState.hasRestored('CONFIG'),
});
```

### Reactive loading from a signal

`reactiveLoadingEffect` binds a `Signal` source to the loading lifecycle. One container owns the source and calls
`connect`; every other component injects the store and reads `state()` read-only. A new source value cancels an
in-flight request automatically.

```ts title="professional-list.store.ts"
@Injectable({ providedIn: 'root' })
export class ProfessionalListStore {
  private api = inject(ProfessionalApi);

  private store = inject(StoreFactory).createComponentLoadingStore<Professional[], ApiError>({
    storeName: 'PROFESSIONAL_LIST',
  });

  public state = this.store.state;

  public connect = this.store.reactiveLoadingEffect('load', (params: SearchParams) => this.api.search(params), {
    skipSameActions: true,
  });
}
```

```ts title="search-page.component.ts"
export class SearchPageComponent {
  private filter = signal<SearchParams>({ query: '' });
  private connected = inject(ProfessionalListStore).connect(this.filter);
}
```

### Functional store

Create a store as a function and inject it without knowing how it is provided. Root stores live as long as the
application; lazy stores are created on demand and can exist multiple times under different names.

```ts title="dynamic-store.ts"
import { inject, Injectable, OnDestroy } from '@angular/core';
import { createStoreAsFn, DynamicStore, StoreFactory } from '@gernsdorfer/ngrx-lite';

type MyDynamicStoreNames = 'StoreA' | 'StoreB';

@Injectable()
class DynamicStoreService extends DynamicStore<MyDynamicStoreNames> implements OnDestroy {
  private store = inject(StoreFactory).createComponentStore<{ counter: number }>({
    storeName: 'Function_Store',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  increment(counter: number) {
    this.store.setState({ counter }, 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

export const dynamicStore = createStoreAsFn(DynamicStoreService);
```

```ts title="counter.component.ts"
export class CounterComponent {
  private store = dynamicStore.inject('StoreA');

  public state = this.store.state;
}
```

### Form Store

```ts
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

interface Product {
  name: string;
  lastName: string;
}

@Component({
  selector: 'my-app-persist-form',
  templateUrl: 'persist-form.html',
})
export class PersistFormComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    formGroup: this.productForm,
    plugins: {
      storage: 'sessionStoragePlugin',
    },
  });

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

### Session/Local Storage

1. Register the session/local storage plugin in your `ApplicationConfig`

```ts title="app.config.ts"
import { LocalStoragePlugin, localStoragePlugin, SessionStoragePlugin, sessionStoragePlugin } from '@gernsdorfer/ngrx-lite';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
};
```

2. Create a new store with a storage sync option

```ts
class MyClass {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: 'SESSION_COUNTER',
    defaultState: {
      counter: 0,
    },
    plugins: {
      storage: 'sessionStoragePlugin',
    },
  });
}
```

### Create Effects

To use `createEffect`, install `@ngrx/effects` and add `provideEffects([])` to your `ApplicationConfig`.

```ts
import { inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { ofType } from '@ngrx/effects';
import { createAction } from '@ngrx/store';
import { tap } from 'rxjs';

export const resetAction = createAction('reset');

class MyClass {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: 'SESSION_COUNTER',
    defaultState: {
      counter: 0,
    },
  });

  myEffect = this.store.createEffect((action) =>
    action.pipe(
      ofType(resetAction),
      tap(() => console.log('do sth.')),
    ),
  );
}
```

### Listen on actions

Listen for custom actions to execute your business logic.

```ts title="my-component-store.service.ts"
export interface MyState {
  counter: number;
}

export const resetAction = createAction('reset');

@Injectable()
export class MyStore {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  onReset = this.store.onActions([resetAction]);
}
```

```ts title="app.component.ts"
export class AppComponent {
  private myStore = inject(MyStore);

  resetEffect = this.myStore.onReset(() => console.log('Reset was triggered'));
}
```

### Testing

Import `storeTestingFactory` and write your tests. A minimal example can be
found [here](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/src/app/component-store/basic/basic.component.spec.ts).

```ts
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';

TestBed.configureTestingModule({
  // standalone components go into imports
  imports: [MyComponent],
  providers: [storeTestingFactory()],
});
```
