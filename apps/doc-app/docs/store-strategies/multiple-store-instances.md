---
sidebar_position: 3
---

# Multiple Store instances

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/multiple-storage-instances)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/muliple-instances)

:::tip
To create multiple instances of a store, the [Functional Store](./functional-store) is the easier way.
:::

The same store class can be instantiated several times, as long as each instance gets its own store name — the name
is the key in the global store, so two instances sharing it would overwrite each other.

## Define the store with a dynamic store name

Provide the name through an `InjectionToken` and read it with `inject(token, { optional: true })`:

```ts title="my-store.service.ts"
import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

// define an InjectionToken for your store name
export const MyStoreName = new InjectionToken<string>('MyStoreName');

export interface MyState {
  counter: number;
}

@Injectable()
export class MyStore implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  // read the provided store name, fall back to a default
  private storeName = inject(MyStoreName, { optional: true });

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: this.storeName || 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

:::note
Read the token with `inject()` in a field initializer, not via a constructor parameter — field initializers run
before the constructor body, so a constructor-injected name would still be `undefined` when the store is created.
:::

## Provide and consume the store per component

Each component provides the store together with its own name:

```ts title="counter-a.component.ts"
import { Component, inject, OnDestroy } from '@angular/core';
import { MyStore, MyStoreName } from './my-store.service';

@Component({
  selector: 'my-app-counter-a',
  template: `<h2>{{ counterState().counter }}</h2>`,
  providers: [
    MyStore,
    // define a dynamic store name for this instance
    {
      provide: MyStoreName,
      useValue: 'counterStoreA',
    },
  ],
})
export class CounterAComponent implements OnDestroy {
  private myStore = inject(MyStore);

  public counterState = this.myStore.counterState;

  ngOnDestroy() {
    this.myStore.ngOnDestroy();
  }
}
```

A second component does the same with a different name, and both appear as separate entries in the DevTools.
