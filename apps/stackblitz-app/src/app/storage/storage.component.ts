import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

@Component({
  selector: 'my-app-session',
  templateUrl: 'storage.html',
})
export class StorageExampleComponent implements OnDestroy {
  private store = this.storeFactory.createStore<number, never>(
    'sessionCounter',
    {
      storage: 'localStoragePlugin',
    }
  );

  public counterState$ = this.store.state$;

  increment() {
    this.store.patchState(({ item = 0 }) => ({ item: item + 1 }), 'INCREMENT');
  }

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
