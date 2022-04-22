import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-basic-custom-action',
  templateUrl: 'custom-action.html',
})
export class CustomActionComponent implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    'customActionCounter'
  );

  public counterState$ = this.counterStore.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number = 0) {
    this.counterStore.patchState({ item: counter + 1 }, 'INCREMENT');
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
