---
sidebar_position: 2
---

# Scoped Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage-from-service)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/service-counter)

A scoped store lives in the injector it is provided in — a route, a component subtree, or a lazy-loaded feature —
and is shared by every component inside that scope.

## Define the store as a service

```ts title="my-store.service.ts"
import { inject, Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Injectable()
export class MyStore implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
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
It's necessary to destroy your store after the scope is destroyed, to avoid side effects.
Call `ngOnDestroy` on the store.
:::

## Provide the store for a scope

Provide it on a route, so every component of that route shares one instance:

```ts title="routes.ts"
import { Routes } from '@angular/router';
import { MyStore } from './my-store.service';

export const routes: Routes = [
  {
    path: 'counter',
    providers: [MyStore],
    loadComponent: () => import('./counter.component').then((m) => m.CounterComponent),
  },
];
```

…or on a component, so the instance lives with that component and its children:

```ts title="parent.component.ts"
@Component({
  selector: 'my-app-parent',
  providers: [MyStore],
  imports: [ChildAComponent, ChildBComponent],
  template: `
    <my-app-child-a />
    <my-app-child-b />
  `,
})
export class ParentComponent {}
```

## Consume the store

```ts title="counter.component.ts"
import { Component, inject } from '@angular/core';
import { MyStore } from './my-store.service';

@Component({
  selector: 'my-app-counter',
  template: `<h2>{{ counterState().counter }}</h2>`,
})
export class CounterComponent {
  private myStore = inject(MyStore);

  public counterState = this.myStore.counterState;
}
```

:::note
If you provide your store in multiple scopes at the same time, create it with a dynamic store name — otherwise both
instances write to the same key. See [Multiple Store instances](/docs/store-strategies/multiple-store-instances).
:::
