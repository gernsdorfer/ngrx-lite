---
sidebar_position: 1
---

# StoreFactory

Here you can find a list of the `StoreFactory` API and their usages:

## `createComponentStore`
Create a new Store based on [ngrx Component Store](https://ngrx.io/guide/component-store).

For more Information about `ngrx-lite/component-store`  the read [here](/docs/api/store)

```ts title="app.component.ts"

export interface MyState {
  counter: number
}
export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  constructor(private storeFactory: StoreFactory) {
  }
}
```

## `createStore` (deprecated)

Create a new Store based on [ngrx Component Store](https://ngrx.io/guide/component-store).
Please use `createComponentStore` or `createLoadingStore`
```ts title="app.component.ts"
export class AppComponent {
  myStore = this.storeFactory.createStore<number, never>('myStore');

  constructor(private storeFactory: StoreFactory) {
  }
}
```



## `createLoadingStore`
Create a LoadingStore based on [ngrx Component Store](https://ngrx.io/guide/component-store).

For more Information about `component-store` from ngrx-lite the read the  [component-store](/docs/api/store#loadingEffect)
For more Information about `ngrx-lite/loading-store`  the read [here](/docs/api/loading-store)

```ts title="app.component.ts"

export interface MyState {
  counter: number
}
export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  constructor(private storeFactory: StoreFactory) {
  }
}
```
