---
sidebar_position: 5
---

# Functional Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/functional-store)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/functional-store)

A store can be created as a function and used either as a root store or as a lazy store. `createStoreAsFn` returns an
object with an `inject()` method, so consumers don't need to know how the store is provided.

## Root Stores

Root stores are created once and live as long as the application does, so you can use the same instance in every
component.

### Define the store as root

```ts title="root-store.ts"
import { inject, Injectable } from '@angular/core';
import { createStoreAsFn, StoreFactory } from '@gernsdorfer/ngrx-lite';

export type RootState = { counter: number };

const providedIn = 'root';

@Injectable({ providedIn })
class RootStoreService {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<RootState>({
    storeName: 'FunctionRootStore',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  increment(counter: number) {
    this.store.setState({ counter }, 'INCREMENT');
  }
}

export const rootStore = createStoreAsFn(RootStoreService, { providedIn });
```

### Consume your root store

```ts title="counter.component.ts"
import { Component } from '@angular/core';
import { rootStore } from './root-store';

@Component({
  selector: 'my-app-counter',
  template: `<h2>{{ state().counter }}</h2>`,
})
export class CounterComponent {
  private rootStore = rootStore.inject();

  public state = this.rootStore.state;
}
```

:::note
A root store is never destroyed, so it does not implement `OnDestroy`.
:::

## Lazy Stores

Lazy stores are created on demand and destroyed when they are no longer used. Extend `DynamicStore` with your store
names so each instance gets its own key, and implement `OnDestroy` to tear the store down.

### Define the store as lazy

```ts title="dynamic-store.ts"
import { inject, Injectable, OnDestroy } from '@angular/core';
import { createStoreAsFn, DynamicStore, StoreFactory } from '@gernsdorfer/ngrx-lite';

export type DynamicState = { counter: number };
type MyDynamicStoreNames = 'StoreA' | 'StoreB';

@Injectable()
class DynamicStoreService extends DynamicStore<MyDynamicStoreNames> implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<DynamicState>({
    storeName: 'Function_Store',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  increment(counter: number) {
    this.store.setState({ counter }, 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

export const dynamicStore = createStoreAsFn(DynamicStoreService);
```

:::note
A lazy store is declared with a plain `@Injectable()` — no `providedIn` — and `createStoreAsFn` is called without
the second argument. The library creates and provides the instance for you.
:::

### Consume your lazy store

Pass the instance name to `inject()`. Each name is a separate store instance:

```ts title="counter.component.ts"
import { Component } from '@angular/core';
import { dynamicStore } from './dynamic-store';

@Component({
  selector: 'my-app-counter',
  template: `<h2>{{ state().counter }}</h2>`,
})
export class CounterComponent {
  private store = dynamicStore.inject('StoreA');

  public state = this.store.state;

  increment() {
    this.store.increment(this.state().counter + 1);
  }
}
```

## Share actions of a lazy store

Use [`getCustomActionWithDynamicStore`](/docs/api/actions#getcustomactionwithdynamicstore) to build an action for a
specific instance — `getCustomAction` does not support dynamic store names.

```ts title="dynamic-store.ts"
import { getCustomActionWithDynamicStore } from '@gernsdorfer/ngrx-lite';

export const dynamicStoreASuccessAction = getCustomActionWithDynamicStore<MyDynamicStoreNames>({
  storeName: 'Function_Store',
  dynamicStoreName: 'StoreA',
  actionName: 'INCREMENT',
});
```

Another store can then react to it with [`onActions`](/docs/api/component-store#onactions):

```ts title="root-store.ts"
onLazyStoreASuccess = this.store.onActions([dynamicStoreASuccessAction]);
```
