import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

@Component({
  selector: 'my-app-session',
  templateUrl: 'storage.html',
})
export class StorageExampleComponent implements OnDestroy {
  private counterStore = this.storeFactory.createStore<number, never>(
    'sessionCounter',
    {
      storage: 'localStoragePlugin',
    }
  );

  public counterState$ = this.counterStore.state$;

  public increment = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
