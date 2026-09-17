import { Component, effect, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-with-signal-effects',
  templateUrl: 'loading-effect.html',
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent, RouterLink],
})
export class LoadingWithSignalEffectsComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private router = inject(Router);
  private queryParams = toSignal(inject(ActivatedRoute).queryParams);

  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'LOADING_BASIC',
    defaultState: {
      item: { counter: 0 },
    },
  });

  public counterState = this.store.state;

  incrementEffect = this.store.loadingEffect('INCREMENT', (counter: number) =>
    of({ counter }),
  );

  // This bridges a signal source to a loadingEffect by hand. For a signal
  // driven loader, reactiveLoadingEffect does this for you — see the
  // "Reactive Loading" demo.
  autoIncrement = effect(() => {
    const counter = this.queryParams()?.['counter'] || 0;
    this.incrementEffect(parseInt(counter, 10));
  });

  increment() {
    this.router.navigate([], {
      queryParams: { counter: (this.store.state()?.item?.counter || 0) + 1 },
      queryParamsHandling: 'merge',
    });
  }
  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
