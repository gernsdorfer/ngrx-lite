import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DemoEffect } from './my-effect.effect';
import { ExampleComponent } from './example.component';
import { RouterModule } from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([DemoEffect]),
    RouterModule.forChild([{ path: '', component: ExampleComponent }]),
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [ExampleComponent],
  providers: [],
})
export class SharedActionsModule {}
