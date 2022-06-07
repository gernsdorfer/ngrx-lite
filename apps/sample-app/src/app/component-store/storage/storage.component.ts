import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiModule } from '../../shared/ui/ui.module';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-app-session',
  templateUrl: 'storage.html',
  standalone: true,
  imports: [UiModule, MatButtonModule, CommonModule],
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

  public counterState$ = this.store.state$;

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
