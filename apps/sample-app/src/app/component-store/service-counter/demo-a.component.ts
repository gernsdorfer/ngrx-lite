import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { CounterStore } from './counter-service';

@Component({
  selector: 'my-app-same-instance-demo-a',
  templateUrl: 'demo.html',
  imports: [UiCardComponent, MatButtonModule],
})
export class DemoAComponent {
  private counterStore = inject(CounterStore);

  title = 'Demo A Component';
  public counterState = this.counterStore.state;

  increment() {
    this.counterStore.increment();
  }
}
