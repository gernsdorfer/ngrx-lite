import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiModule } from '../../shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PersistFormComponent } from './persist-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: PersistFormComponent }]),
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  declarations: [PersistFormComponent],
})
export class PersistFormModule {}
