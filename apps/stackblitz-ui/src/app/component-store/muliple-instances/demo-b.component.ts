import {Component, OnDestroy} from '@angular/core';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from './counter-service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../shared/ui/card-component';

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
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class DemoBComponent implements OnDestroy {
  title = 'Demo B Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
