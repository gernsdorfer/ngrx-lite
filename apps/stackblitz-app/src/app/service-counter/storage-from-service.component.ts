import { Component } from '@angular/core';
import { CounterStore } from './counter-service';

@Component({
  selector: 'my-app-service-counter',
  templateUrl: 'service-counter.html',
})
export class StorageFromServiceComponent {
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: CounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
