---
sidebar_position: 2
---

# Multiple Store instances

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/multiple-storage-instances)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/muliple-instances)

A Store can live in multiple Components/Module with own Scope

## Define the Store as Service and a dynamic Store Name

```ts title="my-component-store.service.ts"
import {Inject, Injectable, OnDestroy, Optional} from '@angular/core';
import {of} from 'rxjs';
import {StoreFactory} from '@gernsdorfer/ngrx-lite';

// define an InjectionToken for your StoreName
export const MyStoreName = new InjectionToken('MyStoreName');
export interface MyState {
  counter: number
}

@Injectable()
export class MyStore implements OnDestroy {

  private store = this.storeFactory.createComponentStore<MyState>({
    // use the provided StoreName
    storeName: this.storeName || 'BASIC_COUNTER',
    defaultState: {counter: 0},
  })
  
  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory,
              // import your StoreName
              @Optional() @Inject(MyStoreSuffix) private storeName: string
  ) {
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
} 
```

:::note It's necessary to destroy your store after your component destroyed, to avoid side effects. Here you muss call
the `ngOnDestroy`.
:::

## Consume and provide your Store in your Component

```ts title="my-component.component.ts"
import {Component, OnDestroy} from '@angular/core';
import {MyStore, MyStoreName} from './my-store.service';

@Component({
  providers: [
    MyStore,
    // Define a Dynamic StoreName
    {
      provide: MyStoreName,
      useValue: 'counterStore'
    }
  ]
})
export class CounterComponent implements OnDestroy {

  public myStoreState$ = this.myStore.counterState$;

  constructor(private myStore: MyStore) {
  }
}
```
