import { Component, OnDestroy } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';

type State = LoadingStoreState<{ counter: number }, { message: string }>;

@Component({
  selector: 'my-app-loading-store-with-default-values',
  templateUrl: 'loading-effect.html',
})
export class LoadingWithDefaultValuesComponent implements OnDestroy {
  private store = this.storeFactory.createLoadingStore<
    State['item'],
    State['error']
  >({
    storeName: 'LOADING_WITH_DEFAULT_VALUES',
    defaultState: {
      item: {
        counter: 0,
      },
    },
  });

  public counterState$ = this.store.state$;

  increment = this.store.loadingEffect('INCREMENT', () =>
    of({ counter: (this.store.state?.item?.counter || 0) + 1 }).pipe(delay(400))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
