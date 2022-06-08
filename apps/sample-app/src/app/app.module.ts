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
import { AppRoutingModule } from './app-routing.module';
import { ReduxForWindowModule } from './shared/util/redux-for-window.service';
import { UiToolbarComponent } from './shared/ui/toolbar';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    UiToolbarComponent,
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      monitor: (state, action) => action,
    }),
    AppRoutingModule,
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
