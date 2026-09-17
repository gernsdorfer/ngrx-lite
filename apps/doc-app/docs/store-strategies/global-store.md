---
sidebar_position: 4
---

# Global Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage-from-global-service)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/global-counter)

:::tip
To create multiple instances of a store, the [Functional Store](./functional-store) is the easier way.
:::

A global store lives as long as your application does and is shared by every component.

## Define the store as a service

Provide your service in `root`:

```ts title="my-store.service.ts"
import { inject, Injectable } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Injectable(
  // define your store in the global scope
  { providedIn: 'root' },
)
export class MyStore {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }
}
```

:::note
A store provided in `root` is never destroyed, so it does **not** implement `OnDestroy` — unlike a
[component](/docs/store-strategies/component-store) or [scoped](/docs/store-strategies/module-store) store.
:::

## Consume the store in your component

```ts title="counter.component.ts"
import { Component, inject } from '@angular/core';
import { MyStore } from './my-store.service';

@Component({
  selector: 'my-app-counter',
  template: `
    <h2>{{ counterState().counter }}</h2>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  private myStore = inject(MyStore);

  public counterState = this.myStore.counterState;

  increment() {
    this.myStore.increment();
  }
}
```
