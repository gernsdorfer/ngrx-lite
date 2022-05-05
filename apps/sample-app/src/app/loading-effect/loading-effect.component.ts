import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'loading-effect.html',
})
export class LoadingEffectComponent implements OnDestroy {
  private store = this.storeFactory.createLoadingStore<number, string>({
    storeName: 'LOADING_EFFECT',
  });

  public counterState$ = this.store.state$;

  increment = this.store.loadingEffect('INCREMENT', (counter: number = 0) =>
    of(counter + 1)
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
