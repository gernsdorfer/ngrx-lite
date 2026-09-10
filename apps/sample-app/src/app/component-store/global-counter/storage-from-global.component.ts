import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { GlobalCounterStore } from './global-counter.service';

@Component({
  selector: 'my-app-global-counter',
  templateUrl: 'service-counter.html',
  imports: [UiCardComponent, MatButtonModule],
})
export class StorageFromGlobalComponent {
  private counterStore = inject(GlobalCounterStore);

  public counterState = this.counterStore.state;

  increment() {
    this.counterStore.increment();
  }
}
