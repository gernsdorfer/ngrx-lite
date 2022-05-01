import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  LocalStoragePlugin,
  localStoragePlugin,
  SessionStoragePlugin,
  sessionStoragePlugin,
} from '@gernsdorfer/ngrx-lite';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { LoadingEffectComponent } from './loading-effect/loading-effect.component';
import { StorageExampleComponent } from './storage/storage.component';
import { StorageFromServiceComponent } from './service-counter/storage-from-service.component';
import { CounterStore } from './service-counter/counter-service';
import { StorageFromGlobalServiceComponent } from './global-counter/storage-from-global-service.component';
import { CustomActionComponent } from './custom-actions/custom-action.component';
import { MultipleInstancesComponent } from './muliple-instances/multiple-instances.component';
import { DemoAComponent } from './muliple-instances/demo-a.component';
import { DemoBComponent } from './muliple-instances/demo-b.component';
import {EffectsModule} from "@ngrx/effects";
import {BasicComponent} from "./basic/basic.component";

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
    }),
    RouterModule.forRoot([
      { path: '', component: BasicComponent },
      { path: 'loading-effect', component: LoadingEffectComponent },
      { path: 'custom-action', component: CustomActionComponent },
      { path: 'storage', component: StorageExampleComponent },
      { path: 'storage-from-service', component: StorageFromServiceComponent },
      {
        path: 'multiple-storage-instances',
        component: MultipleInstancesComponent,
      },
      {
        path: 'storage-from-global-service',
        component: StorageFromGlobalServiceComponent,
      },
      {
        path: 'share-actions',
        loadChildren: () =>
          import('./share-actions/shared-actions.module').then(
            (m) => m.SharedActionsModule
          ),
      },
      { path: '**', redirectTo: '' },
    ], {
      useHash: true
    }),
  ],
  providers: [
    CounterStore,
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  declarations: [
    AppComponent,
    LoadingEffectComponent,
    CustomActionComponent,
    StorageExampleComponent,
    StorageFromServiceComponent,
    StorageFromGlobalServiceComponent,
    MultipleInstancesComponent,
    DemoAComponent,
    DemoBComponent,
    BasicComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
