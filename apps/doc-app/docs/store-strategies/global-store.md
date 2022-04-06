---
sidebar_position: 3
---

# Global Store

A Module Store live in your Application

## Define the Store as Service

Define your Service providedIn in `root`

```ts title="my-store.service.ts"
import {Injectable, OnDestroy} from '@angular/core';
import {delay, of} from 'rxjs';
import {StoreFactory} from '@gernsdorfer/ngrx-lite';

@Injectable({ providedIn: 'root' })
export class MyStore implements OnDestroy {
  private myStore = this.storeFactory.getStore<number, string>('serviceCounter');

  public myStoreState$ = this.myStore.state$;

  public incrementEffect = this.myStore.createEffect('increment', (counter: number = 0) => of(counter + 1));

  constructor(private storeFactory: StoreFactory) {}
} 
```

## Consume your Store in your Component

```ts title="my-component.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { MyStore } from './my-store.service';

@Component()
export class CounterComponent implements OnDestroy {
  
  public myStoreState$ = this.myStore.myStoreState$;

  constructor(private myStore: MyStore) {
  }

  public increment (counter: number): void {
      this.myStore.incrementEffect(counter);
  }
  
}
```

