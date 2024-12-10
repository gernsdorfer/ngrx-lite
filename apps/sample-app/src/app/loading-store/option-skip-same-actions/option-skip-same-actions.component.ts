import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of, tap } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-option-skip-same-actions',
  templateUrl: 'option-skip-same-actions.component.html',
  imports: [
    UiCardComponent,
    MatButtonModule,
    UiSpinnerComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class OptionSkipSameActionsComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'OPTION_SKIP_SAME_ACTIONS',
  });

  public counterState = this.store.state;
  executeEffect = 0;
  increment = this.store.loadingEffect(
    'INCREMENT',
    (count: number) =>
      of({ counter: count }).pipe(tap(() => this.executeEffect++)),
    { skipSameActions: true },
  );

  incrementOne = this.store.loadingEffect(
    'INCREMENT',
    () => of({ counter: 1 }).pipe(tap(() => this.executeEffect++)),
    { skipSameActions: true },
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
