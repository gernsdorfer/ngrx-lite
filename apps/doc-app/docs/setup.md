---
sidebar_position: 2

---

# Quick Setup

## Create new Store 👉 `createStore`

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

:::note More Information for `createStore` you can find [here](/docs/api/component-store-factory#createComponentStore)
:::

## Read State 👉 `state$`

```ts title="app.component.ts"

export interface MyState {
  counter: number
}

export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  public state$: Observable<MyState> = this.store.state$;

  constructor(private storeFactory: StoreFactory) {
  }
}
```

:::note More Information for `state$` you can find [here](/docs/api/component-store#state$)
:::

## Modify state 👉 `effect`  👉 `setState` 👉 `patchState` 👉 `createLoadingEffect`

Choose between [synchronous](#synchronous-state-change) and [asynchronous](#asynchronous-state-change) State Changes.

### Synchronous State Change

#### Complete State Change

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

  update(counter: number) {
    this.store.setState({counter: 2});
  }
}
```

:::note More Information for `setState` you can find [here](/docs/api/component-store#setstate)
:::

#### Partial Changes

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

  patch(counter: number) {
    this.store.patchState({counter: counter});
  }
}
```

:::note More Information for `patchState` you can find [here](/docs/api/component-store#patchstate)
:::

### Asynchronous State Change

#### Change State with the original `effect` from [@ngrx/component-store](https://ngrx.io/guide/component-store/effect)

```ts title="app.component.ts"
export interface MyState {
  counter: number
}

export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  increment = this.myStore.effect((counter$: Observable<number>) => counter$.pipe(
    tapResponse(
      (counter) => this.store.patchState({counter: counter + 1}),
      (error) => console.error('error', error)
    )
  ));

  constructor(private storeFactory: StoreFactory) {
  }
}
```

#### Change State via effects `loadingEffect`

create your store with [`loadingEffect`](/docs/api/component-loading-store#loadingEffect)

```ts title="app.component.ts"

type State = LoadingStoreState<{ counter: number }, { message: string }>;

export class AppComponent {
  private store = this.storeFactory.createComponentLoadingStore<State['item'], State['error']>({
    storeName: 'LOADING_STORE',
  });
  private increment = this.store.createLoadingEffect('LOAD_NAME', (counter: number) => of(counter + 1));

  constructor(private storeFactory: StoreFactory) {
  }
}
```

:::note More Information for `createLoadingEffect` you can find [here](/docs/api/component-loading-store#loadingEffect)
:::
