import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
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
