import { Component } from '@angular/core';
import { GlobalCounterStore } from './global-counter-service';

@Component({
  selector: 'my-service-counter',
  templateUrl: 'service-counter.html',
})
export class StorageFromGlobalServiceComponent {
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: GlobalCounterStore) {}

  increment(counter?: number) {
    this.counterStore.inrement(counter);
  }
}
