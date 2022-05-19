import { Inject, Injectable, Injector, Optional } from '@angular/core';

import { StateToken, StoreNameToken } from '../injection-tokens/state.token';
import { ComponentLoadingStore } from './stores/component-loading-store.service';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ActionReducer, ReducerManager, Store as NgrxStore } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { ComponentStore } from './stores/component-store.service';
import { StoreDevtools } from '@ngrx/store-devtools';
import { LiftedState } from '@ngrx/store-devtools/src/reducer';
import { DevToolHelper } from './dev-tool-helper.service';

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

  public checkForTimeTravel(): void {
    this.storeDevtools?.liftedState.subscribe({
      next: ({ currentStateIndex, stagedActionIds }) => {
        this.devToolHelper.setTimeTravelActive(
          currentStateIndex !== stagedActionIds.length - 1
        );
      },
    });
  }

  public addReducersForImportState(): void {
    this.storeDevtools?.liftedState.subscribe({
      next: ({ monitorState }) => {
        if (monitorState.type === 'IMPORT_STATE') {
          const nextLiftedState: LiftedState = monitorState.nextLiftedState;
          const newStores = [
            ...new Set(
              nextLiftedState.stagedActionIds
                .map((id) => nextLiftedState.actionsById[id].action)
                .map(({ type }) => {
                  const [, currentStoreName] =
                    type.match(/^\[COMPONENT_STORE\]\[(.*?)\]/) || [];
                  return currentStoreName;
                })
                .filter((currentStoreName) => !!currentStoreName)
                .filter(
                  (currentStoreName) =>
                    !this.reducerManager.currentReducers[currentStoreName]
                )
            ),
          ];
          this.reducerManager.addReducers(
            newStores.reduce(
              (start, current) => ({
                ...start,
                [current]: this.getActionReducer(current, {}),
              }),
              {}
            )
          );
          this.storeDevtools.sweep();
        }
      },
    });
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
    this.removeReducerAfterDestroy<STATE>(storeName, store);
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
    if (this.reducerManager.currentReducers?.[storeName]) {
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
      action.type.startsWith(`[COMPONENT_STORE][${storeName}]`)
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
      next: ({ computedStates, currentStateIndex }) => {
        if (this.devToolHelper.isTimeTravelActive()) {
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

  private removeReducerAfterDestroy<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>
  ) {
    store.destroy$.subscribe(() => {
      if (!this.storeDevtools) {
        this.reducerManager.removeReducer(storeName);
      }
    });
  }

  private checkNgrxStoreIsInstalled() {
    if (!this.reducerManager || !this.ngrxStore) {
      throw '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module';
    }
  }
}
