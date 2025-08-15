import { Injectable, OnDestroy, inject } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

interface MyState {
  counter: number;
}

@Injectable({ providedIn: 'any' })
export class CounterStore implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'SERVICE_COUNTER',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT',
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
