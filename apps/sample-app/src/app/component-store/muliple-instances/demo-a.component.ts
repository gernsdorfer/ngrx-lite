import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from './counter-service';

@Component({
  selector: 'my-app-multi-instance-demo-a',
  templateUrl: 'demo.html',
  providers: [
    MultipleCounterStore,
    {
      provide: MultipleCounterStoreName,
      useValue: 'DemoAComponentStore',
    },
  ],
  standalone: true,
  imports: [UiCardComponent, MatButtonModule],
})
export class DemoAComponent implements OnDestroy {
  title = 'Demo A Component';
  public counterState = this.counterStore.state;

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
