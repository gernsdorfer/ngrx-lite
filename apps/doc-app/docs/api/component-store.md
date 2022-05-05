---
sidebar_position: 2
---

# ComponentStore

The Store is a wrapper on the [ngrx Component Store](https://ngrx.io/guide/component-store). You have the exact same API
with some extra Stuff. The extra Stuff you can find below.

## `state$`

The `state$` property is a wrapper of the [ngrx Component Store](https://ngrx.io/guide/component-store).

```ts title="app.component.ts"
interface MyState {
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

## `state`

Read your State synchronously, but be carefully ⚠️

```ts title="app.component.ts"
interface MyState {
  counter: number
}

export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  public state: MyState = this.counterStore.state;

}
```

## `setState`

Update the complete state with the Action name `UPDATE_NAME` or a custom action name for find your changes in the
devtools or to share your action

```ts title="app.component.ts"

interface MyState {
  counter: number;
}

export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });

  constructor(private storeFactory: StoreFactory) {
  }

  change(counter: number) {
    // Patch State with unkown Action   
    this.store.setState({counter: 2});
  }

  changeWithCustomAction(counter: number) {
    // Use custom Action for
    this.store.setState({counter: 2}, 'CUSTOM_SET_STATE_NAME');
  }
}
```

## `patchState`

patch partial State with Action name `PATCH_NAME` or a custom action name for find your changes in the devtools or to
share your action

```ts title="app.component.ts"
interface MyState {
  counter: number
}

export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });

  constructor(private storeFactory: StoreFactory) {
  }

  change() {
    this.store.patchState({counter: 1});
  }

  change(counter: number) {
    // Use custom Action
    this.store.setState({counter: 2}, 'CUSTOM_PATCH_STATE_NAME');
  }
}
```
