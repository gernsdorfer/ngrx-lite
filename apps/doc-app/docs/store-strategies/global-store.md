---
sidebar_position: 3
---

# Global Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage-from-global-service)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/global-counter)


A Module Store live in your Application

## Define the Store as Service

Define your Service providedIn in `root`

```ts title="my-component-store.service.ts"
export interface MyState {
  counter: number
}
@Injectable(
    // Define your Store in the global Scope
    { providedIn: 'root' }
)
export class MyStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: {counter: 0},
  });
  public counterState$ = this.store.state$;
  
  constructor(private storeFactory: StoreFactory) {}
} 
```

## Consume your Store in your Component

```ts title="my-component.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { MyStore } from './my-store.service';

@Component()
export class CounterComponent implements OnDestroy {
  
  public counterState$ = this.myStore.counterState$;

  constructor(private myStore: MyStore) {
  }
}
```

