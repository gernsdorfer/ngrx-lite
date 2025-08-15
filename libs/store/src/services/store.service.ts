import { inject, Injectable, Injector, isDevMode } from '@angular/core';

import { Actions } from '@ngrx/effects';
import {
  Action,
  ActionReducer,
  Store as NgrxStore,
  ReducerManager,
} from '@ngrx/store';
import {
  INITIAL_OPTIONS,
  LiftedState,
  StoreDevtools,
} from '@ngrx/store-devtools';
import { filter, map, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import {
  DynamicStoreName,
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../injection-tokens/state.token';
import { ClientStoragePlugin } from '../models';
import { getFullStoreName } from './action-creator';
import { DevToolHelper } from './dev-tool-helper.service';
import { ComponentLoadingStore } from './stores/component-loading-store.service';
import { ComponentStore } from './stores/component-store.service';

export interface LiftedAction {
  type: string;
  action: Action;
}
export interface LiftedActions {
  [id: number]: LiftedAction;
}

type StoragePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';
type Stores = typeof ComponentStore | typeof ComponentLoadingStore;

export const getStoreState = <STATE extends object>(
  store: ComponentStore<STATE>,
): STATE | undefined => {
  try {
    return store.state();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return undefined;
  }
};

@Injectable({ providedIn: 'root' })
export class Store {
  private currentRunningStores: string[] = [];
  private reducerManager = inject(ReducerManager);
  private ngrxStore = inject(NgrxStore);
  private actions = inject(Actions);

  private sessionStoragePlugin = inject(SessionStoragePlugin, {
    optional: true,
  });
  private localStoragePlugin = inject(LocalStoragePlugin, { optional: true });

  private storeDevtools = inject(StoreDevtools, { optional: true });
  private devToolHelper = inject(DevToolHelper);
  private storeDevtoolsConfig = inject(INITIAL_OPTIONS, { optional: true });

  constructor() {
    this.checkNgrxStoreIsInstalled();
    this.showHintForLowDevTool();
  }

  private showHintForLowDevTool() {
    const minDevToolLimit = 5;
    if (
      this.storeDevtoolsConfig?.maxAge &&
      this.storeDevtoolsConfig.maxAge < minDevToolLimit
    ) {
      console.warn(
        `DevTool maxAge is set to a low value, please increase it to ${minDevToolLimit} or higher. This could lead to problems with the store.`,
      );
    }
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
                    !this.reducerManager.currentReducers[currentStoreName],
                ),
            ),
          ];
          this.reducerManager.addReducers(
            newStores.reduce(
              (start, current) => ({
                ...start,
                [current]: this.getActionReducer(current, {}),
              }),
              {},
            ),
          );
          this.storeDevtools?.sweep();
        }
      },
    });
  }

  public createStoreByStoreType<
    CREATED_STORE extends ComponentStore<STATE>,
    STATE extends object,
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
    const dynamicStoreName = inject(DynamicStoreName, {
      optional: true,
      self: true,
    });
    const fullStoreName = getFullStoreName(storeName, dynamicStoreName);
    const initialState = this.getInitialState<STATE>(
      storeName,
      defaultState,
      storage,
    );

    const store: ComponentStore<STATE> = Injector.create({
      providers: [
        { provide: CreatedStore },
        { provide: DevToolHelper, useValue: this.devToolHelper },
        { provide: Actions, useValue: this.actions },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: fullStoreName },
        { provide: StateToken, useValue: initialState },
        { provide: SkipLogForStore, useValue: skipLogForStore },
        ...additionalProviders,
      ],
    }).get(CreatedStore) as unknown as CREATED_STORE;

    this.addStoreNameToInternalCache(fullStoreName);
    this.addStoreReducerToNgrx<STATE>(fullStoreName, initialState);
    this.syncStoreChangesToClientStorage(fullStoreName, store, storage);
    this.syncNgrxDevtoolStateToStore<STATE>(
      fullStoreName,
      store,
      skipLogForStore,
    );
    this.removeReducerAfterDestroy<STATE>(fullStoreName, store);

    return store as CREATED_STORE;
  }

  addStoreNameToInternalCache(storeName: string): void {
    if (isDevMode() && this.isStoreRunning(storeName)) {
      console.info(
        `A Store with name '${storeName}' is currently running, check if you missed to implement ngOnDestroy for this store`,
      );
    }
    this.currentRunningStores.push(storeName);
  }

  private getInitialState<STATE>(
    storeName: string,
    defaultState: STATE,
    storage?: StoragePluginTypes,
  ): STATE {
    return (
      this.getStoragePluginByKey(storage)?.getDefaultState(storeName) ||
      defaultState
    );
  }

  private getStoragePluginByKey(
    storage?: StoragePluginTypes,
  ): ClientStoragePlugin | undefined {
    if (this.sessionStoragePlugin && storage === 'sessionStoragePlugin')
      return this.sessionStoragePlugin;
    if (this.localStoragePlugin && storage === 'localStoragePlugin')
      return this.localStoragePlugin;
    return;
  }

  private addStoreReducerToNgrx<STATE>(
    storeName: string,
    initialState: STATE,
  ): void {
    if (this.reducerManager.currentReducers?.[storeName]) {
      return;
    }
    this.reducerManager.addReducer(
      storeName,
      this.getActionReducer(storeName, initialState),
    );
  }

  private getActionReducer<STATE>(
    storeName: string,
    initialState: STATE,
  ): ActionReducer<STATE, { payload: STATE; type: string }> {
    return (
      state: STATE = initialState,
      action: { payload: STATE; type: string },
    ): STATE =>
      this.isActionTypeForCurrentStore(action.type, storeName)
        ? action.payload
        : state;
  }

  private syncStoreChangesToClientStorage<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>,
    storage?: StoragePluginTypes,
  ) {
    store.state$.pipe(takeUntil(store.destroy$)).subscribe({
      next: (state) =>
        this.getStoragePluginByKey(storage)?.setStateToStorage(
          storeName,
          state,
        ),
    });
  }

  private syncNgrxDevtoolStateToStore<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>,
    skipLogForStore?: boolean,
  ) {
    if (skipLogForStore) return;
    this.storeDevtools?.liftedState.pipe(takeUntil(store.destroy$)).subscribe({
      next: ({ computedStates, currentStateIndex }) => {
        const currentStoreState = getStoreState(store);
        if (
          currentStoreState &&
          JSON.stringify(computedStates[currentStateIndex].state[storeName]) !==
            JSON.stringify(currentStoreState)
        ) {
          store.setState(
            computedStates[currentStateIndex].state[storeName],
            '',
            {
              skipLog: true,
              forced: true,
            },
          );
        }
      },
    });
  }

  private removeReducerAfterDestroy<STATE extends object>(
    storeName: string,
    store: ComponentStore<STATE>,
  ) {
    store.destroy$
      .pipe(
        tap(
          () =>
            (this.currentRunningStores = this.currentRunningStores.filter(
              (name) => storeName !== name,
            )),
        ),
        filter(() => !this.devToolHelper.isTimeTravelActive()),
        switchMap(
          () => this.storeDevtools?.liftedState || of({ actionsById: [] }),
        ),
        filter(() => !this.devToolHelper.isTimeTravelActive()),
        map(({ actionsById }) => actionsById),
        filter(
          (actionsById) =>
            !this.hasLiftedStateCurrentStoreActions(actionsById, storeName) &&
            !this.isStoreRunning(storeName),
        ),
        take(1),
      )
      .subscribe(() => {
        this.reducerManager.removeReducer(storeName);
        this.storeDevtools?.sweep();
      });
  }

  private isStoreRunning(storeName: string): boolean {
    return this.currentRunningStores.includes(storeName);
  }

  private hasLiftedStateCurrentStoreActions(
    liftedActions: LiftedActions,
    storeName: string,
  ): boolean {
    return Object.keys(liftedActions)
      .map((actionId) =>
        this.isActionTypeForCurrentStore(
          liftedActions[parseInt(actionId)].action.type,
          storeName,
        ),
      )
      .includes(true);
  }

  private isActionTypeForCurrentStore(
    actionType: string,
    storeName: string,
  ): boolean {
    return actionType.startsWith(`[COMPONENT_STORE][${storeName}]`);
  }

  private checkNgrxStoreIsInstalled() {
    if (!this.reducerManager || !this.ngrxStore) {
      throw '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module';
    }
  }
}
