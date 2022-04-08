import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { MovieEffects } from './store/movie.effect';
import { StoreModule } from '@ngrx/store';
import { movieReducer } from './store/movie.reducer';
import {MovieStore} from "./store/movie.store";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ movieStore: movieReducer }),
    EffectsModule.forRoot([MovieEffects]),
  ],
  providers: [MovieStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
