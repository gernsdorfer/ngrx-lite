import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-session',
  templateUrl: 'storage.html',
})
export class StorageExampleComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{counter: number}>({
    storeName: 'LOCAL_COUNTER',
    defaultState: {
      counter:0
    },
    plugins: {
      storage: 'localStoragePlugin',
    },
  });

  public counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ counter }) => ({ counter: counter + 1 }), 'INCREMENT');
  }

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
