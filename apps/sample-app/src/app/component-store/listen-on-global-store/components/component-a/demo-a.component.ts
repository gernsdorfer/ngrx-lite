import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../../../shared/ui/card-component';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from '../../services/counter-service';

@Component({
  selector: 'my-app-listen-on-global-store-demo-a',
  template: `
    <my-app-ui-card>
      <div title>Component-Store A</div>
      <div subtitle>Listen on Global</div>
      <div content>
        <h2 class="counter">{{ counterState().counter }}</h2>
        <h2 class="counter-reset">Listen on Reset Clicks:{{ counterReset }}</h2>
      </div>
      <div actions>
        <button class="increment" (click)="increment()" mat-fab>+</button>
      </div>
    </my-app-ui-card>
  `,
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
  title = 'Demo A Component';
  counterState = this.counterStore.state;
  counterReset = 0;

  private onReset = this.counterStore.onReset(() => {
    this.counterReset++;
  });

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
