import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { UiSpinnerComponent } from '../../shared/ui/spinner';
import { myFactoryStore } from './store';

@Component({
  selector: 'my-app-loading-store-function',
  templateUrl: 'store-function.component.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, UiSpinnerComponent],
})
export class StoreFunctionComponent {
  private counterStore1 = myFactoryStore.inject();
  private counterStore2 = myFactoryStore.inject();
}
