---
sidebar_position: 2
---

# Module Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/storage-from-service)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/service-counter)

A Module Store live in Your Module Scope.

## Define the Store as Service

```ts title="my-component-store.service.ts"
export interface MyState {
  counter: number;
}

@Injectable({ providedIn: 'any' })
export class MyStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });
  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.myStore.ngOnDestroy();
  }
}
```

:::note It's necessary to destroy your store after your component destroyed, to avoid side effects. Here you muss call
the `ngOnDestroy`.
:::

## Provide your Store in your Module

```ts title="my-app.module.ts"
import {BrowserModule} from '@angular/platform-browser';
import {MyStore} from './my-store.service';
import {MyComponent} from './my-component.component';

@NgModule({
  imports: [
    BrowserModule,
  ],
  providers: [
    // Provide your Store
    MyStore
  ],
  declarations: [
    MyComponent
  ]
})
```

## Consume your Store in your Component

```ts title="my-component.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { MyStore } from './my-store.service';

@Component()
export class CounterComponent implements OnDestroy {
  public myStoreState$ = this.myStore.counterState$;

  constructor(private myStore: MyStore) {}
}
```

:::note if you provide your store in Multiple Modules create your Store with a dynamic storeName. How you define a
dynamic storeName you can find [here](/docs/store-strategies/multiple-store-instances)

:::
