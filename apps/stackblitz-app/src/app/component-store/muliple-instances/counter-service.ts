import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export const MultipleCounterStoreName = new InjectionToken('MULTIPLE_COUNTER');

@Injectable()
export class MultipleCounterStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: this.storeName,
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(
    private storeFactory: StoreFactory,
    @Inject(MultipleCounterStoreName)
    private storeName: string = 'MultipleCounterStoreName'
  ) {}

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
