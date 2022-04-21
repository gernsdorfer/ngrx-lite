import { Component } from '@angular/core';

@Component({
  selector: 'my-multi-instance',
  template: `<h1>Multiple State Instances</h1>
    <my-multi-instance-demo-a></my-multi-instance-demo-a>
    <my-multi-instance-demo-b></my-multi-instance-demo-b> `,
})
export class MultipleInstancesComponent {}
