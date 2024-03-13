---
sidebar_position: 3
---

# Functional Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/functional-store)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/functional-store)

Store can now create as a function and can be used as a root store or as a lazy store.

## Root Stores

Root Stores are created once and live as long as the application lives.
So you can create a store for a component and use it in every other component.

### Define the Store as Root

Define your Service providedIn in `root`

```ts title="my-component-store.service.ts"
export interface MyState {
  counter: number;
}
const providedIn = 'root';

@Injectable({ providedIn })
class RootStore implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });
  public state$ = this.store.state$;
}
export const rootStore = createStoreAsFn(RootStore, {
  providedIn: providedIn,
});
```

### Consume your Root Store in your Component

```ts title="my-component.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { rootStore } from './my-store.service';

@Component()
export class CounterComponent {
  private rootStore = rootStore.inject();
  public state$ = this.rootStore.counterState$;
}
```

## Lazy Stores

Lazy Stores are created on demand and are destroyed when not used anymore.
So you can create a store for a component and destroy it when the component is destroyed.
It's necassary to implement the `OnDestroy` interface to destroy the store.

### Define the Store as Root

Define your Lazy Service providedIn in `root`

```ts title="my-component-store.service.ts"
export interface MyState {
  counter: number;
}
type MyDynamicStoreNames = 'StoreA' | 'StoreB';

const providedIn = null;

@Injectable({ providedIn })
class LazyStore extends DynamicStore<MyDynamicStoreNames> implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });
  public state$ = this.store.state$;

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
export const lazyStore = createStoreAsFn(LazyStore, {
  providedIn: providedIn,
});
```

### Consume your Root Store in your Component

```ts title="my-component.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { lazyStore } from './my-store.service';

@Component()
export class CounterComponent {
  private rootStore = lazyStore.inject();
  public state$ = this.rootStore.state$;
}
```
