import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
    selector: 'my-app-basic-app',
    templateUrl: 'basic.html',
    imports: [UiCardComponent, MatButtonModule]
})
export class BasicComponent implements OnDestroy {
  private store = this.storeFactory.createComponentStore<{
    counter: number;
  }>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  constructor(private storeFactory: StoreFactory) {}

  increment(counter: number) {
    // patch your state
    this.store.patchState({ counter });
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
