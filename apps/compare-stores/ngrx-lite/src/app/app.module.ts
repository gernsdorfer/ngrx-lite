import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { MovieStore } from './store/movie.store';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StoreModule.forRoot({})],
  providers: [MovieStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
