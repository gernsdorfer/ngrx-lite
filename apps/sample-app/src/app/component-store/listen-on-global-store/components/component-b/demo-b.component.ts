import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UiCardComponent } from '../../../../shared/ui/card-component';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from '../../services/counter-service';

@Component({
  selector: 'my-app-listen-on-global-store-demo-b',
  template: `
    <my-app-ui-card>
      <div title>Component-Store A</div>
      <div subtitle>Listen on Global</div>
      <div content>
        <h2 class="counter">{{ counterState().counter }}</h2>
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
