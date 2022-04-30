---
sidebar_position: 2

---

# Quick Setup

## Create new Store 👉 `createStore`

```ts title="app.component.ts"
export class AppComponent {
  myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');

  constructor(private storeFactory: StoreFactory) {
  }
}
```

:::note
More Information for `createStore` you can find [here](/docs/api/store-factory#createStore)
:::

## Read State 👉 `state$`

```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');
  public state$ = this.counterStore.state$;

  constructor(private storeFactory: StoreFactory) {
  }
}
```

:::note
More Information for `state$` you can find [here](/docs/api/store#state$)
:::

## Modify state 👉 `createLoadingEffect`  👉 `setState` 👉 `patchState`

Choose between [synchronous](#synchronous-state-change) and [asynchronous](#asynchronous-state-change) State Changes.

### Synchronous State Change

#### Complete State Change

```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');

  constructor(private storeFactory: StoreFactory) {
  }

  update() {
    this.myStore.setState({isLoading: false, item: {name: 'Demo'}}, 'UPDATE_NAME');
  }
}
```
:::note More
Information for `setstate` you can find [here](docs/api/store#setstate)
:::

#### Partial Changes

```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');

  constructor(private storeFactory: StoreFactory) {
  }

  patch() {
    this.myStore.patchState({item: {name: 'Demo'}}, 'PATCH_NAME');
  }
}
```

:::note More
Information for `patchState` you can find [here](docs/api/store#patchState)
:::


### Asynchronous State Change

#### Change State via effects `createLoadingEffect`

```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');
  private nameEffect = this.myStore.createLoadingEffect('LOAD_NAME', (name: string) => of({name: name}));

  constructor(private storeFactory: StoreFactory) {
  }

  public setName(name: string): void {
    this.nameEffect(name);
  }
}
```

:::note More
Information for `createLoadingEffect` you can find [here](/docs/api/store#createLoadingEffect)
:::
