import { Inject, Injectable, Injector, Optional } from '@angular/core';

import {
  DefaultLoadingStateToken,
  StoreNameToken,
} from '../injection-tokens/default-loading-state.token';
import { getDefaultLoadingState, LoadingStore } from './loading-store.service';
import { ClientStoragePlugin, LoadingStoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ActionReducer, ReducerManager, Store as NgrxStore } from '@ngrx/store';
import { filter, map, takeUntil } from 'rxjs';
import { Store } from './store.service';

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';
type Stores = typeof Store | typeof LoadingStore;

@Injectable({ providedIn: 'root' })
export class StoreFactory {
  constructor(
    @Optional() private reducerManager: ReducerManager,
    @Optional() private ngrxStore: NgrxStore,
    @Optional()
    @Inject(SessionStoragePlugin)
    private sessionStoragePlugin: ClientStoragePlugin,
    @Optional()
    @Inject(LocalStoragePlugin)
    private localStoragePlugin: ClientStoragePlugin
  ) {
    this.checkNgrxStoreIsInstalled();
  }

  public createComponentStore<STATE extends object>({
    storeName,
    plugins,
    defaultState,
  }: {
    defaultState: STATE;
    storeName: string;
    plugins?: { storage?: StoragePluginTypes };
  }): Store<STATE> {
    return this.createStoreByStoreType({
      storeName,
      plugins,
      defaultState,
      CreatedStore: Store,
    });
  }

  /** @deprecated use createLoadingStore instead, this methode will be removed in the next major version */
  public createStore<ITEM, ERROR>(
    storeName: string,
    plugins?: { storage?: StoragePluginTypes }
  ): LoadingStore<ITEM, ERROR> {
    return this.createLoadingStore({ storeName, plugins });
  }

  public createLoadingStore<ITEM, ERROR>({
    storeName,
    plugins = {},
  }: {
    storeName: string;
    plugins?: { storage?: StoragePluginTypes };
  }): LoadingStore<ITEM, ERROR> {
    return this.createStoreByStoreType<
      LoadingStore<ITEM, ERROR>,
      LoadingStoreState<ITEM, ERROR>
    >({
      storeName,
      plugins,
      defaultState: getDefaultLoadingState(),
      CreatedStore: LoadingStore,
    });
  }

  private createStoreByStoreType<
    CREATED_STORE extends Store<STATE>,
    STATE extends object
  >({
    CreatedStore,
    storeName,
    defaultState,
    plugins = {},
  }: {
    CreatedStore: Stores;
    defaultState: STATE;
    storeName: string;
    plugins?: { storage?: StoragePluginTypes };
  }): CREATED_STORE {
    const { storage } = plugins;
    const initialState = this.getInitialState<STATE>(
      storeName,
      defaultState,
      storage
    );
    const store = Injector.create({
      providers: [
        { provide: CreatedStore },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: storeName },
        { provide: DefaultLoadingStateToken, useValue: initialState },
      ],
    }).get(CreatedStore);
    this.addStoreReducerToNgrx<STATE>(storeName, initialState);
    this.syncStoreChangesToClientStorage(storeName, store, storage);
    this.syncNgrxStoreChangesToStore<STATE>(storeName, store);
    store.destroy$.subscribe(() =>
      this.reducerManager.removeReducer(storeName)
    );
    return store;
  }

  private getInitialState<STATE>(
    storeName: string,
    defaultState: STATE,
    storage?: StoragePluginTypes
  ): STATE {
    return (
      this.getStoragePluginByKey(storage)?.getDefaultState(storeName) ||
      defaultState
    );
  }

  private getStoragePluginByKey(
    storage?: StoragePluginTypes
  ): ClientStoragePlugin | undefined {
    if (storage === 'sessionStoragePlugin') return this.sessionStoragePlugin;
    if (storage === 'localStoragePlugin') return this.localStoragePlugin;
    return;
  }

  private addStoreReducerToNgrx<STATE>(
    storeName: string,
    initialState: STATE
  ): void {
    if (
      this.reducerManager.currentReducers &&
      this.reducerManager.currentReducers[storeName]
    ) {
      console.warn(
        `store ${storeName} exists, changes will be override. Please destroy your store or rename it before create a new one`
      );
    }
    this.reducerManager.addReducer(
      storeName,
      this.getActionReducer(storeName, initialState)
    );
  }

  private getActionReducer<STATE>(
    storeName: string,
    initialState: STATE
  ): ActionReducer<STATE, { payload: STATE; type: string }> {
    return (
      state: STATE = initialState,
      action: { payload: STATE; type: string }
    ): STATE =>
      action.type.startsWith(`[${storeName}]`)
        ? { ...state, ...action.payload }
        : state;
  }

  private syncStoreChangesToClientStorage<STATE extends object>(
    storeName: string,
    store: Store<STATE>,
    storage?: StoragePluginTypes
  ) {
    store.state$.pipe(takeUntil(store.destroy$)).subscribe({
      next: (state) =>
        this.getStoragePluginByKey(storage)?.setStateToStorage(
          storeName,
          state
        ),
    });
  }

  private syncNgrxStoreChangesToStore<STATE extends object>(
    storeName: string,
    store: Store<STATE>
  ) {
    this.ngrxStore
      .pipe(
        takeUntil(store.destroy$),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter((ngrxState: { [index: string]: any }) => !!ngrxState[storeName]),
        map((ngrxState) => ngrxState[storeName])
      )
      .subscribe({
        next: (state) => store.setState(state, '', true),
      });
  }

  private checkNgrxStoreIsInstalled() {
    if (!this.reducerManager || !this.ngrxStore) {
      throw '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module';
    }
  }
}
