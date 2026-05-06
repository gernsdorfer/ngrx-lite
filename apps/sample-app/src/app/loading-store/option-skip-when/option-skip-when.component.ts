import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of, tap } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<{ value: string }, { message: string }>;

@Component({
  selector: 'my-app-loading-store-option-skip-when',
  templateUrl: 'option-skip-when.component.html',
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
})
export class OptionSkipWhenComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'OPTION_SKIP_WHEN',
  });

  public state = this.store.state;
  public executeCount = 0;
  public skipFlag = false;

  public load = this.store.loadingEffect(
    'LOAD',
    () =>
      of({ value: `loaded #${this.executeCount + 1}` }).pipe(
        tap(() => this.executeCount++),
      ),
    { skipWhen: () => this.skipFlag },
  );

  toggleSkip() {
    this.skipFlag = !this.skipFlag;
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
