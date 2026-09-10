import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of, tap } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';

export type MyState = LoadingStoreState<
  { config: string },
  { message: string }
>;

@Component({
  selector: 'my-app-loading-store-option-auto-load',
  templateUrl: 'option-auto-load.component.html',
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
})
export class OptionAutoLoadComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<
    MyState['item'],
    MyState['error']
  >({
    storeName: 'OPTION_AUTO_LOAD',
  });

  public configState = this.store.state;
  public executeCount = signal(0);

  public reload = this.store.loadingEffect(
    'LOAD_CONFIG',
    () =>
      of({ config: `loaded at ${new Date().toLocaleTimeString()}` }).pipe(
        tap(() => this.executeCount.update((count) => count + 1)),
      ),
    { autoLoad: true },
  );

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
