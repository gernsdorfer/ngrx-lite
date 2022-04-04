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

export { getDefaultState } from './store';
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
    return store;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter((ngrxState: { [index: string]: any }) => !!ngrxState[storeName]),
        map((ngrxState) => ngrxState[storeName]),
        switchMap((storeFromgrxStore) =>
          store.state$.pipe(
            take(1),
            filter(
              (currentState) =>
                JSON.stringify(currentState) !==
                JSON.stringify(storeFromgrxStore)
            ),
            map(() => storeFromgrxStore)
          )
        )
      )
      .subscribe((state) => store.setState(state, '', true));
  }

  private addStoreReducer<ITEM, ERROR>(
    storeName: string,
    initialState: StoreState<ITEM, ERROR>
  ): void {
    this.reducerManager.addReducer(
      storeName,
      (
        state: StoreState<ITEM, ERROR> = initialState,
        action: { payload: StoreState<ITEM, ERROR>; type: string }
      ): StoreState<ITEM, ERROR> =>
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
