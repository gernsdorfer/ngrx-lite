import { Component } from '@angular/core';
import { GlobalCounterStore } from './global-counter.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-global-counter',
  templateUrl: 'service-counter.html',
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class StorageFromGlobalComponent {
  public counterState$ = this.counterStore.counterState$;

  constructor(private counterStore: GlobalCounterStore) {}

  increment() {
    this.counterStore.increment();
  }
}
