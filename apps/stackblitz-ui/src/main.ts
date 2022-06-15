import {importProvidersFrom} from '@angular/core';
import {bootstrapApplication, BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {
  localStoragePlugin,
  LocalStoragePlugin,
  RouterStoreModule,
  sessionStoragePlugin,
  SessionStoragePlugin
} from "@gernsdorfer/ngrx-lite";
import {RouterModule} from "@angular/router";
import {routes} from "./app/app-routing.module";
import {ReduxForWindowModule} from "./app/shared/util/redux-for-window.service";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(StoreModule.forRoot({})),
    importProvidersFrom(EffectsModule.forRoot([])),
    importProvidersFrom(StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
      monitor: (state, action) => action,
    })),
    importProvidersFrom(RouterStoreModule),
    importProvidersFrom(ReduxForWindowModule),
    importProvidersFrom(RouterModule.forRoot(routes, {
      useHash: true,
    })),
    {provide: SessionStoragePlugin, useValue: sessionStoragePlugin},
    {provide: LocalStoragePlugin, useValue: localStoragePlugin},
  ]
})

