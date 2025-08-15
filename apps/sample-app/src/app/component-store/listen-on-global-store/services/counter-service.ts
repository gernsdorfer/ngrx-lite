import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { resetAction } from '../actions/reset.action';

export const MultipleCounterStoreName = new InjectionToken<string>(
  'MULTIPLE_COUNTER',
);

@Injectable({ providedIn: 'any' })
export class MultipleCounterStore implements OnDestroy {
  storeName = inject(MultipleCounterStoreName, { optional: true });
  private store = inject(StoreFactory).createComponentStore<{
    counter: number;
  }>({
    storeName: this.storeName || 'MULTIPLE_COUNTER_STORE',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  onReset = this.store.onActions([resetAction]);

  resetState = this.onReset(() => this.store.setState({ counter: 0 }, 'RESET'));

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
