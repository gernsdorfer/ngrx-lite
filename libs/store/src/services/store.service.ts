import { Inject, Injectable, Injector, Optional } from '@angular/core';

import { StateToken, StoreNameToken } from '../injection-tokens/state.token';
import { ComponentLoadingStore } from './stores/component-loading-store.service';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ActionReducer, ReducerManager, Store as NgrxStore } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { ComponentStore, DevToolHelper } from './stores/component-store.service';
import { StoreDevtools } from '@ngrx/store-devtools';

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';
type Stores = typeof ComponentStore | typeof ComponentLoadingStore;

@Injectable({ providedIn: 'root' })
export class Store {
  constructor(
    private devToolHelper: DevToolHelper,
    @Optional() private reducerManager: ReducerManager,
    @Optional() private ngrxStore: NgrxStore,
    @Optional() private storeDevtools: StoreDevtools,
    @Optional()
    @Inject(SessionStoragePlugin)
    private sessionStoragePlugin: ClientStoragePlugin,
    @Optional()
    @Inject(LocalStoragePlugin)
    private localStoragePlugin: ClientStoragePlugin
  ) {
    this.checkNgrxStoreIsInstalled();
  }

  public createStoreByStoreType<
    CREATED_STORE extends ComponentStore<STATE>,
    STATE extends object
  >({
    CreatedStore,
    storeName,
    defaultState,
    plugins = {},
    additionalProviders = [],
  }: {
    additionalProviders?: never[];
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
        { provide: DevToolHelper, useValue: this.devToolHelper },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: storeName },
        { provide: StateToken, useValue: initialState },
        ...additionalProviders,
      ],
    }).get(CreatedStore);
    this.addStoreReducerToNgrx<STATE>(storeName, initialState);

    this.syncStoreChangesToClientStorage(storeName, store, storage);
    this.syncNgrxDevtoolStateToStore<STATE>(storeName, store);

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
    if (!this.devToolHelper.canChangeState()) {
      return;
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
    store: ComponentStore<STATE>,
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

  private syncNgrxDevtoolStateToStore<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>
  ) {
    this.storeDevtools?.liftedState.pipe(takeUntil(store.destroy$)).subscribe({
      next: ({ computedStates, currentStateIndex, stagedActionIds }) => {
        this.devToolHelper.setCanChangeState(
          currentStateIndex === stagedActionIds.length - 1
        );
        if (
          JSON.stringify(store.state) !==
          JSON.stringify(computedStates[currentStateIndex].state[storeName])
        ) {
          store.setState(
            computedStates[currentStateIndex].state[storeName],
            '',
            {
              skipLog: true,
              forced: true,
            }
          );
        }
      },
    });
  }

  private checkNgrxStoreIsInstalled() {
    if (!this.reducerManager || !this.ngrxStore) {
      throw '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module';
    }
  }
}
