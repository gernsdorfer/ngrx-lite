import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export const MultipleCounterStoreName = new InjectionToken('MULTIPLE_COUNTER');

@Injectable()
export class MultipleCounterStore implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>(this.storeName);

  public counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  constructor(
    private storeFactory: StoreFactory,
    @Inject(MultipleCounterStoreName)
    private storeName: string = 'MultipleCounterStoreName'
  ) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
