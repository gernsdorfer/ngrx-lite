import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  localStoragePlugin,
  LocalStoragePlugin,
  RouterStoreModule,
  sessionStoragePlugin,
  SessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { ReduxForWindowModule } from './app/shared/util/redux-for-window.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
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
});
