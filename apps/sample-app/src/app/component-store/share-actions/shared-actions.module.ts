import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DemoEffect } from './my-effect.effect';
import { SharedActionComponent } from './shared-action.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([DemoEffect]),
    RouterModule.forChild([{ path: '', component: SharedActionComponent }]),
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  declarations: [SharedActionComponent],
  providers: [],
})
export class SharedActionsModule {}
