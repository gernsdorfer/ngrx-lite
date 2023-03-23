import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiToolbarComponent } from './shared/ui/toolbar';

@Component({
  selector: 'my-app',
  styles: [
    `
      .content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    `,
  ],
  standalone: true,
  imports: [UiToolbarComponent, RouterModule],
  templateUrl: 'app.component.html',
})
export class AppComponent {}
