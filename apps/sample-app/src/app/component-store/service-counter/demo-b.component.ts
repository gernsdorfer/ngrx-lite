import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import { CounterStore } from './counter-service';

@Component({
  selector: 'my-app-same-instance-demo-b',
  templateUrl: 'demo.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class DemoBComponent {
  title = 'Demo B Component';
  public counterState = this.counterStore.state;

  constructor(private counterStore: CounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
