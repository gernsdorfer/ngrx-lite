import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'basic.html',
})
export class BasicComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }));
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
