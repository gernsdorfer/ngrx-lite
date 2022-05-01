import { Component } from '@angular/core';
import {
  EffectStates,
  getEffectAction,
  StoreFactory,
  StoreState,
} from '@gernsdorfer/ngrx-lite';

const storeName = 'SHARED_ACTIONS';
const incrementEffectName = 'INCREMENT';

export const MyIncrementAction = getEffectAction<StoreState<number, never>>({
  storeName: storeName,
  effectName: incrementEffectName,
  type: EffectStates.SUCCESS,
});

@Component({
  selector: 'my-app-ngrx-lite-counter',
  templateUrl: 'example.html',
})
export class ExampleComponent {
  private store = this.storeFactory.createStore<number, never>(storeName);
  counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  constructor(private storeFactory: StoreFactory) {}
}
