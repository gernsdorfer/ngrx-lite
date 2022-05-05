import { Component, OnDestroy } from '@angular/core';
import {LoadingStoreState, StoreFactory, StoreState} from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';

type State = StoreState<number, string>;

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'loading-effect.html',
})
export class LoadingEffectComponent implements OnDestroy {
  private store = this.storeFactory.createLoadingStore<
    State['item'],
    State['error']
  >({
    storeName: 'LOADING_EFFECT',
  });

  public counterState$ = this.store.state$;

  increment = this.store.loadingEffect('INCREMENT', () =>
    of((this.store.state?.item || 0) + 1).pipe(delay(400))
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
