import { Component } from '@angular/core';
import { getCustomAction, StoreFactory } from '@gernsdorfer/ngrx-lite';

const storeName = 'SHARED_ACTIONS';
const actionName = 'increment';

export interface MyState {
  counter: number;
}

export const MyIncrementAction = getCustomAction<MyState>({
  storeName: storeName,
  actionName: actionName,
});

@Component({
  selector: 'my-app-ngrx-lite-counter',
  templateUrl: 'example.html',
})
export class SharedActionComponent {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName,
    defaultState: {
      counter: 0,
    },
  });
  counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      actionName
    );
  }
}
