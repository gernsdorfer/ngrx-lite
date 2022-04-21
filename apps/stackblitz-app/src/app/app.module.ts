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
import { BasicExampleComponent } from './basic/basic.component';
import { StorageExampleComponent } from './storage/storage.component';
import { StorageFromServiceComponent } from './service-counter/storage-from-service.component';
import { CounterStore } from './service-counter/counter-service';
import { StorageFromGlobalServiceComponent } from './global-counter/storage-from-global-service.component';
import { CustomActionComponent } from './custom-actions/custom-action.component';
import { MultipleInstancesComponent } from './muliple-instances/multiple-instances.component';
import { DemoAComponent } from './muliple-instances/demo-a.component';
import { DemoBComponent } from './muliple-instances/demo-b.component';

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
      { path: 'custom-action', component: CustomActionComponent },
      { path: 'storage', component: StorageExampleComponent },
      { path: 'storage-from-service', component:  StorageFromServiceComponent},
      { path: 'multiple-storage-instances', component: MultipleInstancesComponent },
      {
        path: 'storage-from-global-service',
        component: StorageFromGlobalServiceComponent,
      },
      { path: '**', redirectTo: '' },
    ]),
  ],
  providers: [
    CounterStore,
    { provide: SessionStoragePlugin, useValue: sessionStoragePlugin },
    { provide: LocalStoragePlugin, useValue: localStoragePlugin },
  ],
  declarations: [
    AppComponent,
    BasicExampleComponent,
    CustomActionComponent,
    StorageExampleComponent,
    StorageFromServiceComponent,
    StorageFromGlobalServiceComponent,
    MultipleInstancesComponent,
    DemoAComponent,
    DemoBComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
