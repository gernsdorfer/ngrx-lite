import { Component } from '@angular/core';

@Component({
  selector: 'my-app-ui-spinner',
  styles: [
    `
      .spinner {
        position: absolute;
        opacity: 0.5;
      }
    `,
  ],
  template: `
    <div class="spinner">
      <mat-spinner color="warn"></mat-spinner>
    </div>
  `,
})
export class UiSpinnerComponent {}
