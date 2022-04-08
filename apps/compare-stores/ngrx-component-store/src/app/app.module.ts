import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MovieStore } from './store/movie.store';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [MovieStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
