import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../shared/ui/card-component';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from './counter-service';

@Component({
    selector: 'my-app-multi-instance-demo-b',
    templateUrl: 'demo.html',
    providers: [
        MultipleCounterStore,
        {
            provide: MultipleCounterStoreName,
            useValue: 'DemoBComponentStore',
        },
    ],
    imports: [UiCardComponent, MatButtonModule]
})
export class DemoBComponent implements OnDestroy {
  title = 'Demo B Component';
  public counterState = this.counterStore.state;

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
