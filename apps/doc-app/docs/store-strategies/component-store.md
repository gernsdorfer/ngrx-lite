---
sidebar_position: 1
---

# Component Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/basic)

Create a Store that lives in Your Component Lifecycle

```ts title="app.component.ts"
import { Component, OnDestroy } from '@angular/core';
import { getDefaultState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

@Component()
export class CounterComponent implements OnDestroy {
  private myStore = this.storeFactory.createStore<number, string>('counter');
  private incrementEffect = this.myStore.createEffect('increment', (counter: number) => of(counter + 1));

  public myStoreState$ = this.counterStore.state$;

  constructor(private storeFactory: StoreFactory) {
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
```

:::note
It's necessary to destroy your store after your component destroyed, to avoid side effects.
Here you muss call the `ngOnDestroy`. 
:::

 
