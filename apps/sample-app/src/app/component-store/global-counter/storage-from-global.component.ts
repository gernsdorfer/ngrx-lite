import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { GlobalCounterStore } from './global-counter.service';

@Component({
  selector: 'my-app-global-counter',
  templateUrl: 'service-counter.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule],
})
export class StorageFromGlobalComponent {
  public counterState = this.counterStore.state;

  constructor(private counterStore: GlobalCounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
