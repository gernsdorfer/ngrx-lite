import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-basic',
  templateUrl: 'loading-basic.html',
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
})
export class LoadingBasicComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'LOADING_BASIC',
  });

  public counterState = this.store.state;

  increment = this.store.loadingEffect('INCREMENT', () =>
    of({ counter: (this.store.state().item?.counter || 0) + 1 }).pipe(
      delay(400),
    ),
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
