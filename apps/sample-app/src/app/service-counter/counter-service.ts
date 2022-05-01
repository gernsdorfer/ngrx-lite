import { Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Injectable({ providedIn: 'any' })
export class CounterStore implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>(
    'SERVICE_COUNTER'
  );

  public counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
