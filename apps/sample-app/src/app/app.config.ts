import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  LocalStoragePlugin,
  RouterStoreModule,
  SessionStoragePlugin,
  localStoragePlugin,
  sessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from './routes';
import { ReduxForWindowModule } from './shared/util/redux-for-window.service';
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(StoreModule.forRoot({})),
    importProvidersFrom(EffectsModule.forRoot([])),
    importProvidersFrom(
      StoreDevtoolsModule.instrument({
        name: 'ngrx-lite-demo',
        maxAge: 25,
        logOnly: false,
        monitor: (state, action) => action,
      })
    ),
    importProvidersFrom(RouterStoreModule),
    importProvidersFrom(ReduxForWindowModule),
    importProvidersFrom(
      RouterModule.forRoot(routes, {
        useHash: true,
      })
    ),
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
};
