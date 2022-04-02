import { Component, VERSION } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of, delay } from 'rxjs';

@Component({
  selector: 'my-session',
  templateUrl: 'storage.html',
})
export class StorageExampleComponent {
  private counterStore = this.storeFactory.getStore<number, never>(
    'session-counter',
    {
      storage: 'localStoragePlugin',
    }
  );

  public counterState$ = this.counterStore.state$;

  public inrement = this.counterStore.createEffect(
    'increment',
    (counter: number = 0) => of(counter + 1).pipe(delay(500))
  );

  constructor(private storeFactory: StoreFactory) {}
}
