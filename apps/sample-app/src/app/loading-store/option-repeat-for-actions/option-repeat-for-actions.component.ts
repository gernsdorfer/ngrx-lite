import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  EffectStates,
  getEffectAction,
  LoadingStoreState,
  StoreFactory,
} from '@gernsdorfer/ngrx-lite';
import { of, tap } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { counter: number },
  { message: string }
>;
const sideEffectStoreName = 'SIDE_STORE';
const sideEffectExampleAction = 'EXAMPLE_ACTION';
const sideEffectAction = getEffectAction({
  storeName: sideEffectStoreName,
  type: EffectStates.SUCCESS,
  effectName: sideEffectExampleAction,
});
@Component({
  selector: 'my-app-loading-option-repeat-for-actions',
  templateUrl: 'option-repeat-for-actions.component.html',
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
export class OptionRepeatForActionsComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'OPTION_REPEAT_FOR_ACTIONS',
  });

  private sideStore = this.storeFactory.createComponentLoadingStore<
    boolean,
    never
  >({
    storeName: sideEffectStoreName,
  });
  public counterState = this.store.state;
  executeEffect = 0;

  runSideEffect = this.sideStore.loadingEffect(sideEffectExampleAction, () =>
    of(true),
  );

  increment = this.store.loadingEffect(
    'INCREMENT',
    (count: number) =>
      of({ counter: count }).pipe(tap(() => this.executeEffect++)),
    { repeatActions: [sideEffectAction] },
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
