import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  localStoragePlugin,
  LocalStoragePlugin,
  sessionStoragePlugin,
  SessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: false,
    }),
  ],
  providers: [
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
