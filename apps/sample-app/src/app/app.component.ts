import { Component } from '@angular/core';

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
  templateUrl: 'app.component.html',
})
export class AppComponent {}
