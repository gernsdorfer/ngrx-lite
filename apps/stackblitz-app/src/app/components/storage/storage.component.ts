import {Component, OnDestroy, VERSION} from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of, delay } from 'rxjs';

@Component({
  selector: 'my-session',
  templateUrl: 'storage.html',
})
export class StorageExampleComponent implements OnDestroy  {
  private counterStore = this.storeFactory.getStore<number, never>(
    'sessionCounter',
    {
      storage: 'localStoragePlugin',
    }
  );

  public counterState$ = this.counterStore.state$;

  public increment = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(200))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
