import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-with-signal-effects',
  templateUrl: 'loading-effect.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
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

  autoIncrement = effect(
    () => {
      const counter = this.queryParams()?.['counter'] || 0;
      this.incrementEffect(parseInt(counter, 10));
    },
    {
      allowSignalWrites: true,
    },
  );

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
