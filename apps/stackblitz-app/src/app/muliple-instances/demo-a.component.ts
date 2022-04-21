import { Component } from '@angular/core';
import {MultipleCounterStore, MultipleCounterStoreName} from './counter-service';

@Component({
  selector: 'my-multi-instance-demo-a',
  templateUrl: 'demo.html',
  providers: [
    MultipleCounterStore,
    {
      provide: MultipleCounterStoreName,
      useValue: 'DemoAComponentStore'
    }
  ]
})
export class DemoAComponent {
  title = 'Demo A Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: MultipleCounterStore) {}

  increment(counter?: number) {
    this.counterStore.inrement(counter);
  }
}
