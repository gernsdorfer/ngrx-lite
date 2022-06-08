import { Component } from '@angular/core';
import { CounterStore } from './counter-service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-same-instance-demo-a',
  templateUrl: 'demo.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class DemoAComponent {
  title = 'Demo A Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: CounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
