import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';
import { myFactoryStore } from './dynamic-store';
import { myRootStore } from './root-store';

@Component({
  selector: 'my-app-loading-store-function',
  templateUrl: 'store-function.component.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
})
export class StoreFunctionComponent {
  private dynamicStore = myFactoryStore.inject();
  private dynamicStoreTypeA = myFactoryStore.inject('StoreA');
  dynamicStoreTypeB = myFactoryStore.inject('StoreB');
  private rootStore = myRootStore.inject();

  stateB = this.dynamicStoreTypeB.counterState;

  onStoreBSuccess = this.rootStore.onStoreBSuccess(() =>
    console.log('Root knows the StoreB Increment Successfully'),
  );

  incrementStoreB() {
    this.dynamicStoreTypeB.increment(1);
  }
}
