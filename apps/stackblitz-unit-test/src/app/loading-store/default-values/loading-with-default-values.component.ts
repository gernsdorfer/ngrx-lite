import { Component, OnDestroy } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiSpinnerComponent } from '../../shared/ui/spinner';
import { UiCardComponent } from '../../shared/ui/card-component';

interface ItemState {
  counter: number;
}

export type MyState = LoadingStoreState<ItemState, { message: string }>;
const defaultState: ItemState = { counter: 0 };

@Component({
  selector: 'my-app-loading-store-with-default-values',
  templateUrl: 'loading-effect.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule, UiSpinnerComponent],
})
export class LoadingWithDefaultValuesComponent implements OnDestroy {
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'LOADING_WITH_DEFAULT_VALUES',
    defaultState: {
      item: defaultState,
    },
  });

  public counterState$ = this.store.state$;

  increment = this.store.loadingEffect('INCREMENT', () =>
    of({
      counter: { ...defaultState, ...this.store.state.item }.counter + 1,
    }).pipe(delay(400))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
