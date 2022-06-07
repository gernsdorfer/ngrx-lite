import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  LocalStoragePlugin,
  localStoragePlugin,
  RouterStoreModule,
  SessionStoragePlugin,
  sessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { UiModule } from './shared/ui/ui.module';
import { AppRoutingModule } from './app-routing.module';
import { ReduxForWindowModule } from './shared/util/redux-for-window.service';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    UiModule,
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      monitor: (state, action) => action,
    }),
    AppRoutingModule,
    MatButtonModule,
    RouterStoreModule,
    ReduxForWindowModule,
  ],
  providers: [
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
