import { Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Injectable({ providedIn: 'any' })
export class CounterStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{counter: number}>({
    storeName: 'SERVICE_COUNTER',
    defaultState: {counter: 0}
  });

  public counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
