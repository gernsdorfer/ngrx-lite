import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../../shared/ui/card-component';
import { Store } from '@ngrx/store';
import { resetAction } from '../../actions/reset.action';

@Component({
  selector: 'my-app-listen-on-global-store-reset',
  template: `
Dispatch Global Actions
 <button class="reset" (click)="reset()" mat-fab>
    reset
  </button>`,
  standalone: true,
  imports: [UiCardComponent, MatButtonModule, CommonModule],
})
export class ResetComponent {
  constructor(private store: Store) {}

  reset() {
    this.store.dispatch(resetAction());
  }
}
