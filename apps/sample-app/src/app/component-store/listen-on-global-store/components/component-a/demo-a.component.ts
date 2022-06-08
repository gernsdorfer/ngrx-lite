import { Component, OnDestroy } from '@angular/core';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from '../../services/counter-service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../../shared/ui/card-component';

@Component({
  selector: 'my-app-listen-on-global-store-demo-a',
  template: `
    <ng-container *ngIf="counterState$ | async as counterState">
      <my-app-ui-card>
        <div title>Component-Store A</div>
        <div subtitle>Listen on Global</div>
        <div content><h2 class="counter">{{ counterState.counter }}</h2></div>
        <div actions>
          <button class="increment" (click)="increment()" mat-fab>+</button>
        </div>
      </my-app-ui-card>
    </ng-container>
  `,
  providers: [
    MultipleCounterStore,
    {
      provide: MultipleCounterStoreName,
      useValue: 'DemoAComponentStore',
    },
  ],
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class DemoAComponent implements OnDestroy {
  title = 'Demo A Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }

  ngOnDestroy() {
    this.counterStore.ngOnDestroy();
  }
}
