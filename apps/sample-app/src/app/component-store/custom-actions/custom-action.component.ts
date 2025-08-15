import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-basic-custom-action',
  templateUrl: 'custom-action.html',
  imports: [UiCardComponent, MatButtonModule],
})
export class CustomActionComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<{
    counter: number;
  }>({
    storeName: 'CUSTOM_ACTION_STORE',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT',
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
