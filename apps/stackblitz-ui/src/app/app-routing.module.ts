import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicComponent } from './component-store/basic/basic.component';
import { LoadingBasicComponent } from './loading-store/basic/loading-basic.component';
import { LoadingWithDefaultValuesComponent } from './loading-store/default-values/loading-with-default-values.component';
import { CustomActionComponent } from './component-store/custom-actions/custom-action.component';
import { StorageExampleComponent } from './component-store/storage/storage.component';
import { StorageFromServiceComponent } from './component-store/service-counter/storage-from-service.component';
import { MultipleInstancesComponent } from './component-store/muliple-instances/multiple-instances.component';
import { StorageFromGlobalComponent } from './component-store/global-counter/storage-from-global.component';

const routes: Routes = [
  { path: '', component: BasicComponent },
  {
    path: 'combine-with-entity',
    //  component: CombineWithEntityComponent
    loadChildren: () =>
      import('./component-store/combine-with-entity/entity-module').then(
        (m) => m.EntityModule
      ),
  },
  {
    path: 'persist-form',

    loadChildren: () =>
      import('./form-store/persist-form/persist-form.module').then(
        (m) => m.PersistFormModule
      ),
  },
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
    component: StorageFromGlobalComponent,
  },
  {
    path: 'share-actions',
    loadChildren: () =>
      import('./component-store/share-actions/shared-actions.module').then(
        (m) => m.SharedActionsModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],

  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {
  // empty.
}