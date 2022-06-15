---
sidebar_position: 1
---

# StoreFactory

Here you can find a list of the `StoreFactory` API and their usages:

OptionName | Description
--- | --- | 
`defaultState` | initial state
`skipLog` | skip all Log Entries for the current created Store
`storeName` | name of the Store
`plugins` | define Plugins ( [ClientStorePlugin](/docs/plugins/storage))

## `createComponentStore`
Create a new Store based on [ngrx Component Store](https://ngrx.io/guide/component-store).

For more Information about `ngrx-lite/component-store`  the read [here](/docs/api/component-store)

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

## `createComponentLoadingStore`
Create a LoadingStore based on [ngrx Component Store](https://ngrx.io/guide/component-store).

For more Information about `component-store` from ngrx-lite the read the  [component-store](/docs/api/component-store#loadingEffect)
For more Information about `ngrx-lite/loading-store`  the read [here](/docs/api/component-loading-store)

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
