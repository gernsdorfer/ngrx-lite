import { Component } from '@angular/core';
import { UiModule } from '../../shared/ui/ui.module';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DemoAComponent } from './demo-a.component';
import { DemoBComponent } from './demo-b.component';

@Component({
  selector: 'my-app-multi-instance',
  template: `
    <h1>Multiple Store instances</h1>
    <my-app-multi-instance-demo-a></my-app-multi-instance-demo-a>
    <br />
    <my-app-multi-instance-demo-b></my-app-multi-instance-demo-b>
  `,
  standalone: true,
  imports: [
    DemoAComponent,
    DemoBComponent,
  ],
})
export class MultipleInstancesComponent {}
