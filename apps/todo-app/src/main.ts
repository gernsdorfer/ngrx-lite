import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterStoreModule } from '@gernsdorfer/ngrx-lite';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument({
        name: 'ngrx-lite-demo',
        maxAge: 25,
        logOnly: false,
        monitor: (state, action) => action,
      })
    ),
    importProvidersFrom(RouterStoreModule),
  ],
});
