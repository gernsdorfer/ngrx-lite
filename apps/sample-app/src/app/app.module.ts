import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  LocalStoragePlugin,
  localStoragePlugin, ReduxForWindowModule,
  RouterStoreModule,
  SessionStoragePlugin,
  sessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { CounterStore } from './component-store/service-counter/counter-service';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { UiModule } from './shared/ui/ui.module';
import { AppRoutingModule } from './app-routing.module';
import { LoadingBasicComponent } from './loading-store/basic/loading-basic.component';
import { CustomActionComponent } from './component-store/custom-actions/custom-action.component';
import { StorageExampleComponent } from './component-store/storage/storage.component';
import { StorageFromServiceComponent } from './component-store/service-counter/storage-from-service.component';
import { StorageFromGlobalComponent } from './component-store/global-counter/storage-from-global.component';
import { MultipleInstancesComponent } from './component-store/muliple-instances/multiple-instances.component';
import { DemoAComponent } from './component-store/muliple-instances/demo-a.component';
import { DemoBComponent } from './component-store/muliple-instances/demo-b.component';
import { BasicComponent } from './component-store/basic/basic.component';
import { LoadingWithDefaultValuesComponent } from './loading-store/default-values/loading-with-default-values.component';
import { StoreWithoutLogComponent } from './component-store/store-without-loging/store-without-log.component';

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
    ReduxForWindowModule
  ],
  providers: [
    CounterStore,
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  declarations: [
    AppComponent,
    LoadingBasicComponent,
    CustomActionComponent,
    StorageExampleComponent,
    StorageFromServiceComponent,
    StorageFromGlobalComponent,
    MultipleInstancesComponent,
    DemoAComponent,
    DemoBComponent,
    BasicComponent,
    LoadingWithDefaultValuesComponent,
    StoreWithoutLogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
