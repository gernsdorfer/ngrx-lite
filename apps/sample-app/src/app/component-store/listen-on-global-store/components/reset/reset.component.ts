import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { resetAction } from '../../actions/reset.action';

@Component({
  selector: 'my-app-listen-on-global-store-reset',
  template: ` Dispatch Global Actions
    <button class="reset" (click)="reset()" mat-fab>reset</button>`,
  imports: [MatButtonModule],
})
export class ResetComponent {
  constructor(private store: Store) {}

  reset() {
    this.store.dispatch(resetAction());
  }
}
