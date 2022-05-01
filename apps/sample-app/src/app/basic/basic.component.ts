import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'basic.html',
})
export class BasicComponent implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>('BASIC_COUNTER');

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
