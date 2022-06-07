import { Component } from '@angular/core';
import { GlobalCounterStore } from './global-counter.service';
import {UiModule} from "../../shared/ui/ui.module";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'my-app-global-counter',
  templateUrl: 'service-counter.html',
  standalone: true,
  imports: [
    UiModule,
    MatButtonModule,
    CommonModule
  ]
})
export class StorageFromGlobalComponent {
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: GlobalCounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
