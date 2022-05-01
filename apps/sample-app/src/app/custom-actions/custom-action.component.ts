import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-basic-custom-action',
  templateUrl: 'custom-action.html',
})
export class CustomActionComponent implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>(
    'CUSTOM_ACTION_STORE'
  );

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState( ({item=0}) => ({ item: item + 1 }), 'INCREMENT');
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
