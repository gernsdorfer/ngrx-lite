import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./component-store/basic/basic.component').then(
        (m) => m.BasicComponent,
      ),
  },
  {
    path: 'combine-with-entity',
    loadComponent: () =>
      import(
        './component-store/combine-with-entity/combine-with-entity.component'
      ).then((m) => m.CombineWithEntityComponent),
  },
  {
    path: 'persist-form',
    loadComponent: () =>
      import('./form-store/persist-form/persist-form.component').then(
        (m) => m.PersistFormComponent,
      ),
  },
  {
    path: 'loading-basic',
    loadComponent: () =>
      import('./loading-store/basic/loading-basic.component').then(
        (m) => m.LoadingBasicComponent,
      ),
  },
  {
    path: 'loading-with-default-values',
    loadComponent: () =>
      import(
        './loading-store/default-values/loading-with-default-values.component'
      ).then((m) => m.LoadingWithDefaultValuesComponent),
  },
  {
    path: 'loading-with-signal-effects',
    loadComponent: () =>
      import(
        './loading-store/with-signal-effects/loading-with-signal-effects.component'
      ).then((m) => m.LoadingWithSignalEffectsComponent),
  },
  {
    path: 'option-skip-same-pending-actions',
    loadComponent: () =>
      import(
        './loading-store/skip-same-pending-actions/option-skip-same-pending-actions.component'
      ).then((m) => m.OptionSkipSamePendingActionsComponent),
  },
  {
    path: 'option-skip-same-actions',
    loadComponent: () =>
      import(
        './loading-store/option-skip-same-actions/option-skip-same-actions.component'
      ).then((m) => m.OptionSkipSameActionsComponent),
  },
  {
    path: 'custom-action',
    loadComponent: () =>
      import('./component-store/custom-actions/custom-action.component').then(
        (m) => m.CustomActionComponent,
      ),
  },
  {
    path: 'storage',
    loadComponent: () =>
      import('./component-store/storage/storage.component').then(
        (m) => m.StorageExampleComponent,
      ),
  },
  {
    path: 'storage-from-service',
    loadComponent: () =>
      import(
        './component-store/service-counter/storage-from-service.component'
      ).then((m) => m.StorageFromServiceComponent),
  },
  {
    path: 'store-without-log',
    loadComponent: () =>
      import(
        './component-store/store-without-loging/store-without-log.component'
      ).then((m) => m.StoreWithoutLogComponent),
  },
  {
    path: 'multiple-storage-instances',
    loadComponent: () =>
      import(
        './component-store/muliple-instances/multiple-instances.component'
      ).then((m) => m.MultipleInstancesComponent),
  },
  {
    path: 'storage-from-global-service',
    loadComponent: () =>
      import(
        './component-store/global-counter/storage-from-global.component'
      ).then((m) => m.StorageFromGlobalComponent),
  },
  {
    path: 'listen-on-global-store',
    loadComponent: () =>
      import(
        './component-store/listen-on-global-store/listen-on-global-store.component'
      ).then((m) => m.ListenOnGlobalStoreComponent),
  },

  {
    path: 'share-actions',
    loadChildren: () =>
      import('./component-store/share-actions/shared-actions.module'),
  },
  { path: '**', redirectTo: '' },
];
