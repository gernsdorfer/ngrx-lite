import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { CounterStore } from './counter-service';

@Component({
  selector: 'my-app-same-instance-demo-b',
  templateUrl: 'demo.html',
  imports: [UiCardComponent, MatButtonModule],
})
export class DemoBComponent {
  private counterStore = inject(CounterStore);

  title = 'Demo B Component';
  public counterState = this.counterStore.state;

  increment() {
    this.counterStore.increment();
  }
}
