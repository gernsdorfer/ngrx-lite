import { provideHttpClient, withXhr } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withXhr()),
    importProvidersFrom(
      BrowserModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument({
        name: 'ngrx-lite-demo',
        maxAge: 25,
        logOnly: false,
        monitor: (state, action) => action,
      }),
    ),
    importProvidersFrom(RouterStoreModule),
  ],
};
