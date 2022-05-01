# NgrxLite

> A small angular State Mangement based on [ngrx](https://github.com/ngrx/platform) component-store, with some benefits 😎

## Why we need this ?

The current [@ngrx/component-store](https://ngrx.io/guide/component-store) implementation works with its own isolated
Store. Unfortunately, there is no connection to the global [@ngrx/Store](https://ngrx.io/guide/store) or
the [@ngrx/store-devtools](https://ngrx.io/guide/store-devtools).

This Library connects your [@ngrx/component-store](https://ngrx.io/guide/component-store) with
the [@ngrx/Store](https://ngrx.io/guide/store) to share and debug
the [@ngrx/actions](https://ngrx.io/guide/store/actions) and store.

## Benefits

- 🤝 same API like [@ngrx/component-store](https://ngrx.io/guide/component-store) with optional parameters
- ⏱ create fast and easy a dynamic redux store
- ⏳ optional integrated loading state for effects
- ⚒️ Support Redux Devtools for your light components-store (only if you use redux-devtools) for
  - patchState
  - setState
  - created effects
- 💽 support session/locale Storage
- 🏘 You Decide where your Store lives: Root, Module or in the Component Scope
- 🔛 Shared your State Changes and Actions in the ngrx Store

<hr />

[![Build Status](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/ci.yml/badge.svg)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![Publish to NPM](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/gernsdorfer/ngrx-lite/actions/workflows/npm-publish.yml)

-
- 🚀 Try out on [StackBlitz](https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-app)
- 👩‍💻 checkout the [Sample-App](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/)
- 📖 read the [docs](http://gernsdorfer.github.io/ngrx-lite/)

## Install

yarn: `yarn add @ngrx/store @gernsdorfer/ngrx-lite`

npm: `npm install @ngrx/store @gernsdorfer/ngrx-lite`

## Usage

1. Import `StoreModule`from [ngrx](https://github.com/ngrx/platform) to your root Module

```ts
@NgModule({
  //...
  imports: [StoreModule.forRoot({})]
//...
```

2. Create Your Store

```ts
import {tapResponse} from "@ngrx/component-store";
import {Observable} from "rxjs";

@Component({
  selector: 'my-component',
  template: '<button (click)="load(\'test\')">',
})
class MyComponent implements OnDestroy {
  private store = this.storeFactory.createStore<MyModel, MyError>('MyStore');
  public myState = this.store.state$;
  
  constructor(private storeFactory: StoreFactory) {
  }

  load () {
    this.store.patchState({item: name}, 'UPDATE_NAME');
  }
  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

That's it 🥳

## What's going on ? Let's have a look into the the redux devtools


## Loading Effects

Create loader Effects to set Loader State while Effect is running

```ts

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'loading-effect.html',
})
export class LoadingEffectComponent implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    'COUNTER_STORE'
  );

  public counterState$ = this.counterStore.state$;

  public increment = this.counterStore.createLoadingEffect(
    'increment',
    (counter: number = 0) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}

```
### Store is init

After the store is init you can find the store in the @ngrx/devtools

![State-Init](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/init.png)


### Loader State `isloading` changed

For a running Effect `isLoading` is true and you can show a spinner in your UI.

![State-Loading](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/load.png)

### Effect run successfully

After an Effect run Successfully the `item` key is updated

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/success.png)

### Effect run unsuccessfully

After an Effect run unsuccessfully the `error` key contains the error

![State-Success](https://raw.githubusercontent.com/gernsdorfer/ngrx-lite/master/screens/error.png)

## Session/Local Storage

#### Register Session/Locale-Storage Service

1. Register Session/Locale-Storage in your Root-Module

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

1. Create your new Store with a session Storage Sync Option

```ts
class MyLCass {
  private store = this.storeFactory.getStore<MyModel, MyError>('MyStore', {
    storage: 'sessionStoragePlugin',
  });
}
```

## Devtool support

your must only use and install the [ngrx/store-devtools](https://ngrx.io/guide/store-devtools)

## Change State without effects

Every State Change's should have an custom name, to identify the action in your devtools. In the Example below you can
see an Action named `[MyStore] RESET`.   
If you didn't define an Action name you can see an Action `[MyStore] UNKNOWN`.

```ts
class MyComponent implements OnDestroy {
  private store = this.storeFactory.getStore<MyModel, MyError>('MyStore');

  constructor(private storeFactory: StoreFactory) {
  }

  reset() {
    // you cann see a `RESET` action in your Devtools
    store.setState({isLoading: false}, 'RESET')
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

## Testing

Import `storeTestingFactory` and write your test's An Example you can
find [here](https://github.com/gernsdorfer/ngrx-lite/blob/master/apps/sample-app/src/app/basic/basic.component.spec.ts)

```ts
TestBed.configureTestingModule({
  //...
  providers: [storeTestingFactory()],
  //..
});
```
