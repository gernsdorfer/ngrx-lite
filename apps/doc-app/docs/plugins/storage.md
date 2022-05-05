---
sidebar_position: 1
---

# Storage

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/storage)

## Session Storage

Store your State in the Client Session Storage

### install Session Storage

provide `SessionStoragePlugin` with `sessionStoragePlugin` in your root module.

```ts title="app.module.ts"
import {NgModule} from '@angular/core';
import {
  SessionStoragePlugin,
  sessionStoragePlugin
} from '@gernsdorfer/ngrx-lite';

@NgModule({
  providers: [
    {provide: SessionStoragePlugin, useValue: sessionStoragePlugin}
  ]
})
export class AppModule {
}
```

### create a new Store sync to Session Storage

Based on [Created Store](/docs/api/component-store-factory#createStore) you can add the storage option `localStoragePlugin` for the new Store.
The data will write and read from the SessionStorage the Session Storage Key is the StoreName in the Example above it's named `myStore` 

```ts title="app.component.ts"
export class AppComponent {
  myStore = this.storeFactory.createStore<string, string>('myStore', {storage: 'localStoragePlugin'});

  constructor(private storeFactory: StoreFactory) {
  }
}
```

### write a Custom Session Storage

To write your own Session Storage, you muss create Service implement's the 

```ts title="my-session-storage.plugin.ts"
import { ClientStoragePlugin } from '@gernsdorfer/ngrx-lite';

class MySessionStoragePlugin implements ClientStoragePlugin {
  getDefaultState<T, E>(storeName: string): StoreState<T, E> | undefined {
   // Your Busincess Logic
  }

  setStateToStorage<T, E>(storeName: string, state: StoreState<T, E>) {
    // Your Busincess Logic
  }
} 
```

and provide this new Storage in your root Module

```ts title="app.module.ts"
import {NgModule} from '@angular/core';
import {
  SessionStoragePlugin,
  sessionStoragePlugin
} from '@gernsdorfer/ngrx-lite';
import {MySessionStoragePlugin} from './my-session-storage.plugin.ts';

@NgModule({
  providers: [
    {provide: SessionStoragePlugin, useClass: MySessionStoragePlugin}
  ]
})
export class AppModule {
}
```

## Local Storage

Store your State in the Client Local Storage

### install Local Storage

provide `LocalStoragePlugin` with `LocalStoragePlugin` in your root module.

```ts title="app.module.ts"
import {NgModule} from '@angular/core';
import {
  LocalStoragePlugin,
  LocalStoragePlugin
} from '@gernsdorfer/ngrx-lite';

@NgModule({
  providers: [
    {provide: LocalStoragePlugin, useValue: LocalStoragePlugin}
  ]
})
export class AppModule {
}
```

### create a new Store sync to Local Storage

Based on [Created Store](/docs/api/component-store-factory#createStore) you can add the storage option `localStoragePlugin` for the new Store.
The data will write and read from the LocalStorage the Local Storage Key is the StoreName in the Example above it's named `myStore`

```ts title="app.component.ts"
export interface MyState {
  counter: number
}
export class AppComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
    plugins: {
      storage: 'localStoragePlugin',
    },
  });
  
  constructor(private storeFactory: StoreFactory) {
  }
}
```

### write a Custom Local Storage

To write your own Local Storage, you muss create Service implement's the

```ts title="my-Local-storage.plugin.ts"
import { ClientStoragePlugin } from '@gernsdorfer/ngrx-lite';

class MyLocalStoragePlugin implements ClientStoragePlugin {
  getDefaultState<STATE>(storeName: string): StoreState<STATE> | undefined {
   // Your Busincess Logic
  }

  setStateToStorage<STATE>(storeName: string, state: StoreState<STATE>) {
    // Your Busincess Logic
  }
} 
```

and provide this new Storage in your root Module

```ts title="app.module.ts"
import {NgModule} from '@angular/core';
import {
  LocalStoragePlugin,
  LocalStoragePlugin
} from '@gernsdorfer/ngrx-lite';
import {MyLocalStoragePlugin} from './my-Local-storage.plugin.ts';

@NgModule({
  providers: [
    {provide: LocalStoragePlugin, useClass: MyLocalStoragePlugin}
  ]
})
export class AppModule {
}
```

