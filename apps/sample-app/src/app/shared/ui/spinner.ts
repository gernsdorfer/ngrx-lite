import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatProgressSpinnerModule],
})
export class UiSpinnerComponent {}
