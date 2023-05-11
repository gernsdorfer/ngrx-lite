import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-store-without-loging',
  templateUrl: 'store-without-log.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class StoreWithoutLogComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{
    counter: number;
  }>({
    storeName: 'STORE_WITHOUT_LOG',
    defaultState: { counter: 0 },
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    skipLog: true,
  });

  public counterState = this.store.state;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number) {
    // patch your state
    this.store.patchState({ counter });
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
