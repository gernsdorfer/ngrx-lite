import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-session',
  templateUrl: 'storage.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule],
})
export class StorageExampleComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{ counter: number }>({
    storeName: 'LOCAL_COUNTER',
    defaultState: {
      counter: 0,
    },
    plugins: {
      storage: 'localStoragePlugin',
    },
  });

  public counterState = this.store.state;

  constructor(private storeFactory: StoreFactory) {}

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT'
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
