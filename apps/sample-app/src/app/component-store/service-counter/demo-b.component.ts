import { Component } from '@angular/core';
import { CounterStore } from './counter-service';
import { UiModule } from '../../shared/ui/ui.module';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'my-app-same-instance-demo-b',
  templateUrl: 'demo.html',
  standalone: true,
  imports: [UiModule, MatButtonModule, CommonModule],
})
export class DemoBComponent {
  title = 'Demo B Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: CounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
