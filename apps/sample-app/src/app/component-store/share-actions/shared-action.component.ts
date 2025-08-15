import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { getCustomAction, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

const storeName = 'SHARED_ACTIONS';
const actionName = 'increment';

interface MyState {
  counter: number;
}

export const MyIncrementAction = getCustomAction<MyState>({
  storeName: storeName,
  actionName: actionName,
});

@Component({
  selector: 'my-app-ngrx-lite-counter',
  templateUrl: 'example.html',
  imports: [UiCardComponent, MatButtonModule],
})
export default class SharedActionComponent {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName,
    defaultState: {
      counter: 0,
    },
  });
  counterState = this.store.state;

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      actionName,
    );
  }
}
