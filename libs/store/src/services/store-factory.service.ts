import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs';
import { LoadingStoreState } from '../models';
import { Store } from './store.service';
import {
  ComponentLoadingStore,
  getDefaultComponentLoadingState,
} from './stores/component-loading-store.service';
import { ComponentStore } from './stores/component-store.service';

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';

@Injectable({ providedIn: 'root' })
export class StoreFactory {
  private store = inject(Store);
  constructor() {
    this.store.checkForTimeTravel();
    this.store.addReducersForImportState();
  }

  public createComponentStore<STATE extends object>({
    storeName,
    plugins,
    defaultState,
    skipLog,
  }: {
    defaultState: STATE;
    plugins?: { storage?: StoragePluginTypes };
    skipLog?: boolean;
    storeName: string;
  }): ComponentStore<STATE> {
    return this.store.createStoreByStoreType({
      defaultState,
      CreatedStore: ComponentStore,
      plugins,
      skipLogForStore: skipLog,
      storeName,
    });
  }

  public createFormComponentStore<FORM_STATE extends object>({
    storeName,
    plugins,
    formGroup,
    skipLog,
  }: {
    formGroup: FormGroup;
    storeName: string;
    plugins?: { storage?: StoragePluginTypes };
    skipLog?: boolean;
  }): ComponentStore<FORM_STATE> {
    const store = this.store.createStoreByStoreType({
      storeName,
      plugins,
      skipLogForStore: skipLog,
      defaultState: formGroup.getRawValue(),
      CreatedStore: ComponentStore,
    });
    formGroup.patchValue(store.state());
    formGroup.valueChanges.pipe(takeUntil(store.destroy$)).subscribe({
      next: (value: FORM_STATE) => {
        store.setState(value, 'Form_CHANGED', { skipLog });
      },
    });

    store.state$
      .pipe(
        takeUntil(store.destroy$),
        filter(
          (state) =>
            JSON.stringify(state) !== JSON.stringify(formGroup.getRawValue()),
        ),
      )
      .subscribe({
        next: (state) => formGroup.patchValue(state),
      });

    return store;
  }

  public createComponentLoadingStore<ITEM, ERROR>({
    defaultState,
    plugins = {},
    skipLog,
    storeName,
  }: {
    defaultState?: {
      item?: ITEM;
      error?: ERROR;
    };
    plugins?: { storage?: StoragePluginTypes };
    skipLog?: boolean;
    storeName: string;
  }): ComponentLoadingStore<ITEM, ERROR> {
    return this.store.createStoreByStoreType<
      ComponentLoadingStore<ITEM, ERROR>,
      LoadingStoreState<ITEM, ERROR>
    >({
      storeName,
      plugins,
      defaultState: getDefaultComponentLoadingState(defaultState),
      skipLogForStore: skipLog,
      CreatedStore: ComponentLoadingStore,
    });
  }
}
