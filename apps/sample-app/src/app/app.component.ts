import {Component} from '@angular/core';
import {UiToolbarComponent} from "./shared/ui/toolbar";
import {RouterModule} from "@angular/router";

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
  imports: [
    UiToolbarComponent,
    RouterModule
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent {
}
