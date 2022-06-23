import { Inject, Injectable, Injector, Optional } from '@angular/core';

import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../injection-tokens/state.token';
import { ComponentLoadingStore } from './stores/component-loading-store.service';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ActionReducer, ReducerManager, Store as NgrxStore } from '@ngrx/store';
import {filter, map, of, switchMap, take, takeUntil, tap} from 'rxjs';
import { ComponentStore } from './stores/component-store.service';
import {
  INITIAL_OPTIONS,
  StoreDevtools,
  StoreDevtoolsConfig,
} from '@ngrx/store-devtools';
import { LiftedActions, LiftedState } from '@ngrx/store-devtools/src/reducer';
import { DevToolHelper } from './dev-tool-helper.service';
import { Actions } from '@ngrx/effects';

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';
type Stores = typeof ComponentStore | typeof ComponentLoadingStore;

@Injectable({ providedIn: 'root' })
export class Store {
  constructor(
    private devToolHelper: DevToolHelper,
    @Optional() private reducerManager: ReducerManager,
    @Optional() private ngrxStore: NgrxStore,
    @Optional() private actions: Actions,
    @Optional() private storeDevtools: StoreDevtools,
    @Optional()
    @Inject(SessionStoragePlugin)
    private sessionStoragePlugin: ClientStoragePlugin,
    @Optional()
    @Inject(LocalStoragePlugin)
    private localStoragePlugin: ClientStoragePlugin,
    @Optional() @Inject(INITIAL_OPTIONS) private config: StoreDevtoolsConfig
  ) {
    this.checkNgrxStoreIsInstalled();
  }

  public checkForTimeTravel(): void {
    this.storeDevtools?.liftedState.subscribe({
      next: ({ currentStateIndex, stagedActionIds }) => {
        const isTimeTravelActive =
          currentStateIndex !== stagedActionIds.length - 1;
        this.devToolHelper.setTimeTravelActive(isTimeTravelActive);
      },
    });
  }

  public addReducersForImportState(): void {
    this.storeDevtools?.liftedState.subscribe({
      next: ({ monitorState }) => {
        if (monitorState?.type === 'IMPORT_STATE') {
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
    additionalProviders = [],
    CreatedStore,
    defaultState,
    plugins = {},
    skipLogForStore,
    storeName,
  }: {
    additionalProviders?: never[];
    CreatedStore: Stores;
    defaultState: STATE;
    plugins?: { storage?: StoragePluginTypes };
    skipLogForStore?: boolean;
    storeName: string;
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
        { provide: Actions, useValue: this.actions },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: storeName },
        { provide: StateToken, useValue: initialState },
        { provide: SkipLogForStore, useValue: skipLogForStore },
        ...additionalProviders,
      ],
    }).get(CreatedStore);
    this.addStoreReducerToNgrx<STATE>(storeName, initialState);

    this.syncStoreChangesToClientStorage(storeName, store, storage);
    this.syncNgrxDevtoolStateToStore<STATE>(storeName, store, skipLogForStore);
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
      this.isActionTypeForCurrentStore(action.type, storeName)
        ? action.payload
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
    store: ComponentStore<STATE>,
    skipLogForStore?: boolean
  ) {
    if (skipLogForStore) return;
    this.storeDevtools?.liftedState.pipe(takeUntil(store.destroy$)).subscribe({
      next: ({ computedStates, currentStateIndex }) => {
        if (
          JSON.stringify(computedStates[currentStateIndex].state[storeName]) !==
          JSON.stringify(store.state)
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

  private removeReducerAfterDestroy<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>
  ) {
    store.destroy$
      .pipe(
        filter(() => !this.devToolHelper.isTimeTravelActive()),
        switchMap(() => this.storeDevtools?.liftedState || of({})),
        filter(() => !this.devToolHelper.isTimeTravelActive()),
        map(({ actionsById = [] }) => actionsById),
        filter(
          (actionsById) =>
            !this.hasLiftedStateCurrentStoreActions(actionsById, storeName)
        ),

        take(1)
      )
      .subscribe(() => {
        this.reducerManager.removeReducer(storeName);
        this.storeDevtools?.sweep();
      });
  }

  private hasLiftedStateCurrentStoreActions(
    liftedActions: LiftedActions,
    storeName: string
  ): boolean {
    return Object.keys(liftedActions)
      .map((actionId) =>
        this.isActionTypeForCurrentStore(
          liftedActions[parseInt(actionId)].action.type,
          storeName
        )
      )
      .includes(true);
  }

  private isActionTypeForCurrentStore<STATE>(
    actionType: string,
    storeName: string
  ): boolean {
    return actionType.startsWith(`[COMPONENT_STORE][${storeName}]`);
  }

  private checkNgrxStoreIsInstalled() {
    if (!this.reducerManager || !this.ngrxStore) {
      throw '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module';
    }
  }
}
