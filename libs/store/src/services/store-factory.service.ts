import { Inject, Injectable, Injector, Optional } from '@angular/core';

import {
  DefaultStateToken,
  StoreNameToken,
} from '../injection-tokens/default-state.token';
import { getDefaultState, Store } from './store';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ReducerManager, Store as NgrxStore } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';

type storagePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';

@Injectable({ providedIn: 'root' })
export class StoreFactory {
  constructor(
    private reducerManager: ReducerManager,
    private ngrxStore: NgrxStore,
    @Optional()
    @Inject(SessionStoragePlugin)
    private sessionStoragePlugin: ClientStoragePlugin,
    @Optional()
    @Inject(LocalStoragePlugin)
    private localStoragePlugin: ClientStoragePlugin
  ) {}

  private getStorageByKey(
    storage?: storagePluginTypes
  ): ClientStoragePlugin | undefined {
    if (storage === 'sessionStoragePlugin') return this.sessionStoragePlugin;
    if (storage === 'localStoragePlugin') return this.localStoragePlugin;
    return;
  }

  getStore<ITEM, ERROR>(
    storeName: string,
    { storage }: { storage?: storagePluginTypes } = {}
  ): Store<ITEM, ERROR> {
    const initialState = this.getInitialState<ITEM, ERROR>(storeName, storage);
    const store = Injector.create({
      providers: [
        { provide: Store },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: storeName },
        { provide: DefaultStateToken, useValue: initialState },
      ],
    }).get(Store);

    this.addStoreReducer<ITEM, ERROR>(storeName, initialState);
    this.storeStateChangesToClientStorage(storeName, store, storage);
    this.changeStateFromExternalChanges<ITEM, ERROR>(storeName, store);
    this.sendStateChangesToNrgxStore(storeName, store);
    return store;
  }

  private sendStateChangesToNrgxStore<ITEM, ERROR>(
    storeName: string,
    store: Store<ITEM, ERROR>
  ) {
    store.state$
      .pipe(
        switchMap((currentState) =>
          this.ngrxStore.pipe(
            take(1),
            filter(
              (ngrxState: { [index: string]: any }) =>
                JSON.stringify(currentState) !==
                JSON.stringify(ngrxState[storeName])
            ),
            map(() => currentState)
          )
        )
      )
      .subscribe((state) => {
        this.ngrxStore.dispatch({
          type: `[${storeName}] CUSTOM`,
          payload: state,
        });
      });
  }

  private storeStateChangesToClientStorage<ITEM, ERROR>(
    storeName: string,
    store: Store<ITEM, ERROR>,
    storage?: storagePluginTypes
  ) {
    store.state$.subscribe((state) =>
      this.getStorageByKey(storage)?.setStateToStorage(storeName, state)
    );
  }

  private changeStateFromExternalChanges<ITEM, ERROR>(
    storeName: string,
    store: Store<ITEM, ERROR>
  ) {
    this.ngrxStore
      .pipe(
        switchMap((ngrxState: { [index: string]: any }) =>
          store.state$.pipe(
            take(1),
            filter(() => !!ngrxState[storeName]),
            filter(
              (currentState) =>
                JSON.stringify(currentState) !==
                JSON.stringify(ngrxState[storeName])
            ),
            map(() => ngrxState[storeName])
          )
        )
      )
      .subscribe((state) => {
        store.setState(state);
      });
  }

  private addStoreReducer<ITEM, ERROR>(
    storeName: string,
    initialState: StoreState<ITEM, ERROR>
  ): void {
    this.reducerManager.addReducer(
      storeName,
      <T>(
        state: StoreState<ITEM, ERROR> = initialState,
        action: { payload: StoreState<ITEM, ERROR>; type: string }
      ): T | StoreState<ITEM, ERROR> =>
        action.type.startsWith(`[${storeName}]`)
          ? { ...state, ...action.payload }
          : state
    );
  }

  private getInitialState<ITEM, ERROR>(
    storeName: string,
    storage?: storagePluginTypes
  ): StoreState<ITEM, ERROR> {
    return (
      this.getStorageByKey(storage)?.getDefaultState(storeName) ||
      getDefaultState()
    );
  }
}
