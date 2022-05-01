import { Component } from '@angular/core';

@Component({
  selector: 'my-app-multi-instance',
  template: `<h1>Multiple State Instances</h1>
    <my-app-multi-instance-demo-a></my-app-multi-instance-demo-a>
    <my-app-multi-instance-demo-b></my-app-multi-instance-demo-b> `,
})
export class MultipleInstancesComponent {}
