import { Component } from '@angular/core';
import { GlobalCounterStore } from './global-counter.service';

@Component({
  selector: 'my-app-service-counter',
  templateUrl: 'service-counter.html',
})
export class StorageFromGlobalComponent {
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: GlobalCounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
