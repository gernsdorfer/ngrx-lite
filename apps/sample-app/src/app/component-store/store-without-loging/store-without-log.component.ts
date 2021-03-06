import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../shared/ui/card-component';

export interface MyState {
  counter: number;
}

@Component({
  selector: 'my-app-store-without-loging',
  templateUrl: 'store-without-log.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class StoreWithoutLogComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'STORE_WITHOUT_LOG',
    defaultState: { counter: 0 },
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    skipLog: true,
  });

  public counterState$ = this.store.state$;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number) {
    // patch your state
    this.store.patchState({ counter });
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
