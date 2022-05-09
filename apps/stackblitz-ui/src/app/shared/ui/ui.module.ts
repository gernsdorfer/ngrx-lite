import { NgModule } from '@angular/core';
import { UiCardComponent } from './card-component';
import { MatCardModule } from '@angular/material/card';
import { UiSpinnerComponent } from './spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiToolbarComponent } from './toolbar';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  providers: [],
  declarations: [UiCardComponent, UiSpinnerComponent, UiToolbarComponent],
  exports: [UiCardComponent, UiSpinnerComponent, UiToolbarComponent],
})
export class UiModule {}
