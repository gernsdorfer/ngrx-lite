import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiModule } from '../../shared/ui/ui.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageFromServiceComponent } from './storage-from-service.component';
import { CounterStore } from './counter-service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: StorageFromServiceComponent },
    ]),
    UiModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [CounterStore],
  declarations: [StorageFromServiceComponent],
})
export class ServiceCounterModule {}
