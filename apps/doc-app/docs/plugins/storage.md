---
sidebar_position: 1
---

# Storage

Keep a store in sync with the browser's `sessionStorage` or `localStorage`. The storage key is the `storeName`, and
the stored value is used as the initial state the next time the store is created.

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/storage)

## Session Storage

### Provide the plugin

Provide the `SessionStoragePlugin` token with the `sessionStoragePlugin` value in your `ApplicationConfig`:

```ts title="app.config.ts"
import { ApplicationConfig } from '@angular/core';
import { SessionStoragePlugin, sessionStoragePlugin } from '@gernsdorfer/ngrx-lite';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: SessionStoragePlugin, useValue: sessionStoragePlugin }],
};
```

:::note
The uppercase `SessionStoragePlugin` is the injection token, the lowercase `sessionStoragePlugin` is the
implementation. You need both.
:::

### Sync a store to the Session Storage

Add the storage option `sessionStoragePlugin` when you
[create the store](/docs/api/store-factory#createcomponentstore). The state is written to and read from
`sessionStorage` under the key `BASIC_COUNTER`:

```ts title="app.component.ts"
import { Component, inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  /* ... */
})
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
    plugins: {
      storage: 'sessionStoragePlugin',
    },
  });
}
```

## Local Storage

### Provide the plugin

```ts title="app.config.ts"
import { ApplicationConfig } from '@angular/core';
import { LocalStoragePlugin, localStoragePlugin } from '@gernsdorfer/ngrx-lite';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: LocalStoragePlugin, useValue: localStoragePlugin }],
};
```

### Sync a store to the Local Storage

```ts title="app.component.ts"
export class AppComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
    plugins: {
      storage: 'localStoragePlugin',
    },
  });
}
```

## Write a custom storage

Both tokens accept any implementation of `ClientStoragePlugin`:

```ts
interface ClientStoragePlugin {
  getDefaultState: <STATE>(storeName: string) => STATE | undefined;
  setStateToStorage: <STATE>(storeName: string, data: STATE) => void;
}
```

`getDefaultState` is called once when the store is created — return `undefined` to fall back to the `defaultState`.
`setStateToStorage` is called on every state change.

```ts title="my-storage.plugin.ts"
import { Injectable } from '@angular/core';
import { ClientStoragePlugin } from '@gernsdorfer/ngrx-lite';

@Injectable()
export class MyStoragePlugin implements ClientStoragePlugin {
  getDefaultState<STATE>(storeName: string): STATE | undefined {
    // your business logic
    return undefined;
  }

  setStateToStorage<STATE>(storeName: string, data: STATE): void {
    // your business logic
  }
}
```

Provide it in place of the built-in implementation:

```ts title="app.config.ts"
import { ApplicationConfig } from '@angular/core';
import { SessionStoragePlugin } from '@gernsdorfer/ngrx-lite';
import { MyStoragePlugin } from './my-storage.plugin';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: SessionStoragePlugin, useClass: MyStoragePlugin }],
};
```

:::tip
A custom plugin is also the place to add encryption, a version prefix, or a size guard before writing to the
browser storage.
:::
