import { Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Injectable({ providedIn: 'root' })
export class GlobalCounterStore implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>(
    'GLOBAL_COUNTER'
  );

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
