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
import { LoadingBasicComponent } from './loading-store/basic/loading-basic.component';
import { StorageExampleComponent } from './component-store/storage/storage.component';
import { StorageFromServiceComponent } from './component-store/service-counter/storage-from-service.component';
import { CounterStore } from './component-store/service-counter/counter-service';
import { StorageFromGlobalServiceComponent } from './component-store/global-counter/storage-from-global-service.component';
import { CustomActionComponent } from './component-store/custom-actions/custom-action.component';
import { MultipleInstancesComponent } from './component-store/muliple-instances/multiple-instances.component';
import { DemoAComponent } from './component-store/muliple-instances/demo-a.component';
import { DemoBComponent } from './component-store/muliple-instances/demo-b.component';
import { EffectsModule } from '@ngrx/effects';
import { BasicComponent } from './component-store/basic/basic.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingWithDefaultValuesComponent } from './loading-store/default-values/loading-with-default-values.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    StoreDevtoolsModule.instrument({
      name: 'ngrx-lite-demo',
      maxAge: 25,
      logOnly: false,
    }),
    RouterModule.forRoot(
      [
        { path: '', component: BasicComponent },
        { path: 'loading-basic', component: LoadingBasicComponent },
        {
          path: 'loading-with-default-values',
          component: LoadingWithDefaultValuesComponent,
        },
        { path: 'custom-action', component: CustomActionComponent },
        { path: 'storage', component: StorageExampleComponent },
        {
          path: 'storage-from-service',
          component: StorageFromServiceComponent,
        },
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
            import(
              './component-store/share-actions/shared-actions.module'
            ).then((m) => m.SharedActionsModule),
        },
        { path: '**', redirectTo: '' },
      ],
      {
        useHash: true,
      }
    ),
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
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
    StorageFromGlobalServiceComponent,
    MultipleInstancesComponent,
    DemoAComponent,
    DemoBComponent,
    BasicComponent,
    LoadingWithDefaultValuesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
