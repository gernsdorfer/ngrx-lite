import { Component } from '@angular/core';
import {
  MultipleCounterStore,
  MultipleCounterStoreName,
} from './counter-service';
import {UiModule} from "../../shared/ui/ui.module";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

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
  standalone: true,
  imports: [
    UiModule,
    MatButtonModule,
    CommonModule,

  ]
})
export class DemoAComponent {
  title = 'Demo A Component';
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: MultipleCounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
