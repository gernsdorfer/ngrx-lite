import { Component } from '@angular/core';
import {MultipleCounterStore, MultipleCounterStoreName} from './counter-service';

@Component({
  selector: 'my-app-multi-instance-demo-b',
  templateUrl: 'demo.html',
  providers: [
    MultipleCounterStore,
    {
      provide: MultipleCounterStoreName,
      useValue: 'DemoBComponentStore'
    }
  ]
})
export class DemoBComponent {
  title = 'Demo B Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: MultipleCounterStore) {}

  increment(counter?: number) {
    this.counterStore.inrement(counter);
  }
}
