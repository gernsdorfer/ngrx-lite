---
sidebar_position: 2
---

# Store

The Store is a wrapper on the [ngrx Component Store](https://ngrx.io/guide/component-store)

## `state$`

The `state$` property is a wrapper of the [ngrx Component Store](https://ngrx.io/guide/component-store).
 

```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');
  public state$ = this.counterStore.state$;

  constructor(private storeFactory: StoreFactory) {
  }
}
```

The State interface for Example above looks like that

```ts
 interface MyStoreState{
    isLoading: boolean;
    item?: { 
        name: string
    };
    error?:{ 
        errorCode: number 
    };
}
```

you can generate state interface with the Helper Interface `StoreState`

```ts
import { StoreState} from '@gernsdorfer/ngrx-lite';

type MyStoreState = StoreState<{ name: string }, { errorCode: number }>;
```

## `state`

Read your State synchronously, but be carefully ⚠️


```ts title="app.component.ts"
export class AppComponent {
  private myStore = this.storeFactory.createStore<{ name: string }, { errorCode: number }>('myStore');
  public state = this.counterStore.state;

}
```

## `setState`

Update the complete state with the Action name `UPDATE_NAME`

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


## `patchState`

patch partial State with Action name `PATCH_NAME`

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
