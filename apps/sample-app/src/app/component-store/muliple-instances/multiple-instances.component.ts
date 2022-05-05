import { Component } from '@angular/core';

@Component({
  selector: 'my-app-multi-instance',
  template: `
    <my-app-multi-instance-demo-a></my-app-multi-instance-demo-a>
    <br>
    <my-app-multi-instance-demo-b></my-app-multi-instance-demo-b> `,
})
export class MultipleInstancesComponent {}
