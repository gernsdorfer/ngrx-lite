import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'basic.html',
})
export class BasicComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number) {
    // patch your state
    this.store.patchState({ counter });
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
