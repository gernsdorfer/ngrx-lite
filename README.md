[![Test, Lint, Build](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/ci.yml/badge.svg)]()
[![Publish to NPM](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml)
[![styled with](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![ngrx-lite](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/hjc4hp/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/hjc4hp/runs)

# NgRxLite

> A small Angular state mangement based on [NgRx](https://github.com/ngrx/platform) ComponentStore, with some benefits 😎

## Synopsis

The current [@ngrx/component-store](https://ngrx.io/guide/component-store) implementation works with its own isolated
store. Unfortunately, there is no connection to the global [@ngrx/store](https://ngrx.io/guide/store) or
the [@ngrx/store-devtools](https://ngrx.io/guide/store-devtools).

This Library connects your [@ngrx/component-store](https://ngrx.io/guide/component-store) with
the [@ngrx/store](https://ngrx.io/guide/store) to share and debug
the [@ngrx/actions](https://ngrx.io/guide/store/actions) and store.

## Benefits

- 🤝 same API as [@ngrx/component-store](https://ngrx.io/guide/component-store) with optional parameters
- ⏱ fast and easy creation of a dynamic Redux store
- ⏳ optional integrated loading state for effects
- 🤯 debuging of application state across different routes
- ⚒️ Redux DevTools support for NgRxLite ComponentsStore for
  - `patchState`
  - `setState`
  - `createdLoadingEffects`
- 💽 supports session storage and local storage
- 🏘 freedom to decide where the store is located: root, module or in the component scope
- 🔛 share the state changes and actions in the NgRx store
- 📑 store the form data for persistance and debugging
- 👂 create effects for global storage
- ✍️ write the tests is much easier

<hr />

- 👩‍💻 checkout the [sample app](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/)
- 📖 read the [docs](http://gernsdorfer.github.io/ngrx-lite/)

## UI Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-ui)

## Test Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-unit-test)

## Install

### Yarn

```bash
yarn add @ngrx/store @gernsdorfer/ngrx-lite
```

### NPM

```bash
npm install @ngrx/store @gernsdorfer/ngrx-lite
```

## Usage

1. import the `StoreModule` from [NgRx](https://github.com/ngrx/platform) to the root module

```ts
@NgModule({
  // ...
  imports: [StoreModule.forRoot({})]
// ...
```

2. create the store with the same API as [@ngrx/component-store](https://ngrx.io/guide/component-store)

```ts
export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-component',
  template: '<button (click)="load(\'test\')">',
})
class MyComponent implements OnDestroy {
  // create a componentStore
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  // read the state
  public counterState$: Observable<MyState> = this.store.state$;

  constructor(private storeFactory: StoreFactory) {
  }

  increment(counter: number) {
    // patch your state
    this.store.patchState({counter});
  }

  ngOnDestroy() {
    // destory the store
    this.store.ngOnDestroy();
  }
}
```

That's it 🥳

## Features

### DevTools support

Install and import [ngrx/store-devtools](https://ngrx.io/guide/store-devtools) und have all the features from the
DevTools for your component store.

It's important to set the `monitor` property in your `StoreDevtoolsOptions`, otherwise a state import is not possible.

```ts app.module
@NgModule({
  imports: [
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      // set the monitor property here
      monitor: (state, action) => action,
    }),

  ],
})
```

Let's take a look at Redux DevTools and what happens in the example above.

#### Store is initialized

After the store is initialized you can find the store in the `@ngrx/devtools`.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/component-store-devtools-init.png)

#### Patch state

After patch state you see this in your Redux DevTools. It's possbile to define an custom action name for your patch/set
state.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/component-store-devtools-patch.png)

### Router store

Import the `RouterStoreModule` into your main application to debug your state across all visited URLs. This module
stores related URLs to the current store.

So it's possible to replay your state changes by revisiting the related url.

```ts
@NgModule({
  //...
  imports: [RouterStoreModule]
//...
```

### Loading store

Create ComponentLoadingStore to set a Loader State while an Effect is running. You have the same API
as `createComponentStore` with an extra method `loadingEffect`.

```ts
type State = LoadingStoreState<{ counter: number }, { message: string }>;

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'loading-effect.html',
})
export class LoadingEffectComponent implements OnDestroy {
  // create your loading store
  private store = this.storeFactory.createComponentLoadingStore<State['item'],
    State['error']>({
    storeName: 'LOADING_STORE',
  });

  // read the state
  public counterState$: Observable<State> = this.store.state$;

  // define your loadingEffect to change the state
  public increment = this.store.loadingEffect(
    'increment',
    (counter: number = 0) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {
  }

  ngOnDestroy() {
    // destory the store
    this.counterStore.ngOnDestroy();
  }
}
```

Let's take a look at Redux DevTools and what happens in the example above.

#### Store is initialized

After the store is initialized you can find the store in the `@ngrx/devtools`.

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/init.png)

#### Loader state `isLoading` changed

For a running Effect `isLoading` is true and you can show a spinner in your UI.

![State-Loading](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/load.png)

#### Effect successfully executed

After an effect was successfully executed the `item` key is updated.

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/success.png)

#### Effect unsuccessfully executed

After an effect was unsuccessfully executed the `error` key contains the error.

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/error.png)

### Form Store

```ts
interface Product {
  name: string;
}

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'persist-form.html',
})
export class PersistFormComponent implements OnDestroy {
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    formGroup: this.productForm,
  });
}
```

### Session/Local Storage

#### Register Session/Locale storage service

1. Register Session/Locale storage in your root module

```ts
@NgModule({
  // ...
  providers: [
    {provide: SessionStoragePlugin, useValue: sessionStoragePlugin},
    {provide: LocalStoragePlugin, useValue: localStoragePlugin}
  ]
  // ...
})
```

1. Create new store with a session storage sync option

```ts
class MyLCass {
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

### createEffects

```ts
export const resetAction = createAction('reset');

class MyLCass {
  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: 'SESSION_COUNTER',
    defaultState: {
      counter: 0,
    },
  });

  myEffect = this.store.createEffect((action) =>
    action.pipe(
      ofType(resetAction),
      tap(() => console.log('do sth.'))
    )
  );
}
```

### Testing

Import `storeTestingFactory` and write your tests. A minimal example can be
found [here](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/src/app/component-store/basic/basic.component.spec.ts)
.

All demo unit tests can be found
here: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-unit-test)

```ts
TestBed.configureTestingModule({
  //...
  providers: [storeTestingFactory()],
  //..
});
```
