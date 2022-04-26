# NgrxLite

> A small angular State Mangement based on [ngrx](https://github.com/ngrx/platform) component-store, with some benefits 😎

- ⏱ create fast and easy a dynamic redux store
- ⏳ integrated loading state
- ⚒️ Support Redux Devtools for your light components-store (only if you use redux-devtools) for
  - patchState
  - setState
  - created effects
- 💽 support session/locale Storage
- 🏘 You Decide where your Store lives: Root, Module or in the Component Scope
- 🤝 Shared your State Changes and Actions in the ngrx Store

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
@Component({
  selector: 'my-component',
  template: '<button (click)="load(\'test\')">',
})
class MyComponent implements OnDestroy {
  private store = this.storeFactory.createStore<MyModel, MyError>('MyStore');

  public myState = this.readAssetKiStore.state$;
  public load = this.readAssetKiStore.createEffect('myEffect', (name) =>
    of({name})
  );

  constructor(private storeFactory: StoreFactory) {
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

That's it 🥳

## What's going on ? Let's have a look into the the redux devtools

### Loader State `isloading` changed

You can now show an Loader for your Application

![State-Loading](screens/store-start.png)

### Data is ready

Now you can  show your Data

![State-Done](screens/store-success.png)

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
