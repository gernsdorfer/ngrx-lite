import { Injectable } from '@angular/core';
import {
  ComponentLoadingStore,
  getDefaultComponentLoadingState,
} from './component-loading-store.service';
import { LoadingStoreState } from '../models';
import { filter, takeUntil } from 'rxjs';
import { ComponentStore } from './component-store.service';
import { FormGroup } from '@angular/forms';
import { Store } from './store.service';

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';

@Injectable({ providedIn: 'root' })
export class StoreFactory {
  constructor(private store: Store) {}

  public createComponentStore<STATE extends object>({
    storeName,
    plugins,
    defaultState,
  }: {
    defaultState: STATE;
    storeName: string;
    plugins?: { storage?: StoragePluginTypes };
  }): ComponentStore<STATE> {
    return this.store.createStoreByStoreType({
      storeName,
      plugins,
      defaultState,
      CreatedStore: ComponentStore,
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
      defaultState: formGroup.getRawValue(),
      CreatedStore: ComponentStore,
    });
    formGroup.patchValue(store.state);
    formGroup.valueChanges.pipe(takeUntil(store.destroy$)).subscribe({
      next: (value) => {
        store.setState(value, 'Form_CHANGED', { skipLog });
      },
    });

    store.state$
      .pipe(
        takeUntil(store.destroy$),
        filter(
          (state) =>
            JSON.stringify(state) !== JSON.stringify(formGroup.getRawValue())
        )
      )
      .subscribe({
        next: (state) => formGroup.patchValue(state),
      });

    return store;
  }

  /** @deprecated use createComponentLoadingStore instead, this methode will be removed in the next major version */
  public createStore<ITEM, ERROR>(
    storeName: string,
    plugins?: { storage?: StoragePluginTypes }
  ): ComponentLoadingStore<ITEM, ERROR> {
    return this.createComponentLoadingStore({ storeName, plugins });
  }

  public createComponentLoadingStore<ITEM, ERROR>({
    storeName,
    defaultState,
    plugins = {},
  }: {
    storeName: string;
    defaultState?: {
      item?: ITEM;
      error?: ERROR;
    };
    plugins?: { storage?: StoragePluginTypes };
  }): ComponentLoadingStore<ITEM, ERROR> {
    return this.store.createStoreByStoreType<
      ComponentLoadingStore<ITEM, ERROR>,
      LoadingStoreState<ITEM, ERROR>
    >({
      storeName,
      plugins,
      defaultState: getDefaultComponentLoadingState(defaultState),
      CreatedStore: ComponentLoadingStore,
    });
  }
}
