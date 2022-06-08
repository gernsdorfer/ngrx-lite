import { Component } from '@angular/core';
import { DemoAComponent } from './demo-a.component';
import { DemoBComponent } from './demo-b.component';
import { ResetComponent } from './reset.component';

@Component({
  selector: 'my-app-listen-on-global-store',
  template: `
    <h1>Listen on global Store</h1>
    <my-app-listen-on-global-store-reset></my-app-listen-on-global-store-reset>
    <my-app-listen-on-global-store-demo-a></my-app-listen-on-global-store-demo-a>
    <br />
    <my-app-listen-on-global-store-demo-b></my-app-listen-on-global-store-demo-b>
  `,
  standalone: true,
  imports: [DemoAComponent, DemoBComponent, ResetComponent],
})
export class ListenOnGlobalStoreComponent {}
