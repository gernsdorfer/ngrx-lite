import { Component, OnDestroy, inject } from '@angular/core';
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
  imports: [UiCardComponent, MatButtonModule],
})
export class DemoBComponent implements OnDestroy {
  private counterStore = inject(MultipleCounterStore);

  title = 'Demo B Component';
  public counterState = this.counterStore.state;

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
