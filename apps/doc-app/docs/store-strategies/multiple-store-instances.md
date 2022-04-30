---
sidebar_position: 2
---

# Multiple Store instances

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/multiple-storage-instances)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/muliple-instances)


A Store can live in multiple Components/Module with own Scope

## Define the Store as Service and a dynamic Store Name

```ts title="my-store.service.ts"
import {Inject, Injectable, OnDestroy, Optional} from '@angular/core';
import {of} from 'rxjs';
import {StoreFactory} from '@gernsdorfer/ngrx-lite';

// define an InjectionToken for your StoreName
export const MyStoreName = new InjectionToken('MyStoreName');

@Injectable()
export class MyStore implements OnDestroy {

  private myStore = this.storeFactory.createStore<number, string>(
    // use the provided StoreName
    this.storeName || 'myStore'
  );

  public myStoreState$ = this.myStore.state$;

  public incrementEffect = this.myStore.createLoadingEffect('increment', (counter: number = 0) => of(counter + 1));

  constructor(private storeFactory: StoreFactory,
              // import your StoreName
              @Optional() @Inject(MyStoreSuffix) private storeName: string
  ) {
  }

  ngOnDestroy() {
    this.myStore.ngOnDestroy();
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

  public myStoreState$ = this.myStore.myStoreState$;

  constructor(private myStore: MyStore) {
  }

  public increment(counter: number): void {
    this.myStore.incrementEffect(counter);
  }

}
```
