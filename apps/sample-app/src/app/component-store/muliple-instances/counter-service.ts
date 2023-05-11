import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
} from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export const MultipleCounterStoreName = new InjectionToken('MULTIPLE_COUNTER');

@Injectable({ providedIn: 'any' })
export class MultipleCounterStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{
    counter: number;
  }>({
    storeName: this.storeName || 'MULTIPLE_COUNTER_STORE',
    defaultState: { counter: 0 },
  });

  public state = this.store.state;

  constructor(
    private storeFactory: StoreFactory,
    @Optional()
    @Inject(MultipleCounterStoreName)
    private storeName?: string
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
