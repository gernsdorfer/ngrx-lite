---
sidebar_position: 1
---

# Component Store

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/basic)

Create a store that lives with your component's lifecycle.

```ts title="counter.component.ts"
import { Component, inject, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-app-counter',
  template: `
    <h2>{{ counterState().counter }}</h2>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent implements OnDestroy {
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
It's necessary to destroy your store after your component is destroyed, to avoid side effects.
Call `ngOnDestroy` on the store.
:::
