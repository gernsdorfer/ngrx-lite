import { Injectable, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState { counter: number };
@Injectable({ providedIn: 'root' })
export class GlobalCounterStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'GLOBAL_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT'
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
