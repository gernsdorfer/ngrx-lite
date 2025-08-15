import { Component, OnDestroy, inject } from '@angular/core';
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
  imports: [UiCardComponent, MatButtonModule],
})
export class DemoAComponent implements OnDestroy {
  private counterStore = inject(MultipleCounterStore);

  title = 'Demo A Component';
  public counterState = this.counterStore.state;

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
