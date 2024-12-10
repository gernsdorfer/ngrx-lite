import { Component } from '@angular/core';
import { CounterStore } from './counter-service';
import { DemoAComponent } from './demo-a.component';
import { DemoBComponent } from './demo-b.component';

@Component({
    selector: 'my-app-service-counter',
    template: `
    <h1>Share Store to ChildComponents</h1>
    <my-app-same-instance-demo-a></my-app-same-instance-demo-a>
    <br />
    <my-app-same-instance-demo-b></my-app-same-instance-demo-b>
  `,
    providers: [CounterStore],
    imports: [DemoAComponent, DemoBComponent]
})
export class StorageFromServiceComponent {}
