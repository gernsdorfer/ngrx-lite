import { Component } from '@angular/core';
import {
  EffectStates,
  getEffectAction,
  StoreFactory,
  StoreState,
} from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

const storeName = 'counter';
const incrementEffectName = 'increment';

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
  private counterStore = this.storeFactory.createStore<number, never>(
    storeName
  );
  counterState$ = this.counterStore.state$;

  increment = this.counterStore.createEffect(
    incrementEffectName,
    (counter: number) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}
}
