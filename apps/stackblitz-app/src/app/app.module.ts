import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  LocalStoragePlugin,
  SessionStoragePlugin,
  localStoragePlugin,
  sessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { BasicExampleComponent } from './basic/basic.component';
import { StorageExampleComponent } from './storage/storage.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
    }),
    RouterModule.forRoot([
      { path: '', component: BasicExampleComponent },
      { path: 'storage', component: StorageExampleComponent },
      { path: '**', redirectTo: '' },
    ]),
  ],
  providers: [
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  declarations: [AppComponent, BasicExampleComponent, StorageExampleComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
