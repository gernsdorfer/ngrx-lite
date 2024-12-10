import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { dynamicStore } from './dynamic-store';
import { rootStore } from './root-store';

@Component({
  selector: 'my-app-store-functional',
  templateUrl: 'functional-store.component.html',
  imports: [UiCardComponent, MatButtonModule],
})
export class FunctionalStoreComponent {
  private dynamicStoreTypeA = dynamicStore.inject('StoreA');
  private rootStore = rootStore.inject();

  stateB = this.dynamicStoreTypeA.state;
  lazyStoreBSuccess?: string;

  onLazyStoreBSuccess = this.rootStore.onLazyStoreBSuccess(
    () =>
      (this.lazyStoreBSuccess =
        'Root Store knows the StoreA Increment Successfully'),
  );

  incrementStoreB() {
    this.dynamicStoreTypeA.increment(1);
  }
}
