import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { delay, of, tap } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-performance',
  templateUrl: 'performance.html',
  standalone: true,
  imports: [
    UiCardComponent,
    MatButtonModule,
    UiSpinnerComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class PerformanceComponent implements OnDestroy {
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'LOADING_BASIC',
  });

  public counterState = this.store.state;
  executeEffect = 0;
  increment = this.store.loadingEffect(
    'INCREMENT',
    (count: number) =>
      of({ counter: count }).pipe(
        tap(() => this.executeEffect++),
        delay(2000),
      ),
    { canCache: true },
  );

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
