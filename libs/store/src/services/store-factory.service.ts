import { Inject, Injectable, Injector, Optional } from '@angular/core';

import {
  DefaultStateToken,
  StoreNameToken,
} from '../injection-tokens/default-state.token';
import { getDefaultState, Store } from './store';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';

import { ActionReducer, ReducerManager, Store as NgrxStore } from '@ngrx/store';
import { filter, map, takeUntil } from 'rxjs';

type storagePluginTypes = 'sessionStoragePlugin' | 'localStoragePlugin';

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

  public createStore<ITEM, ERROR>(
    storeName: string,
    { storage }: { storage?: storagePluginTypes } = {}
  ): Store<ITEM, ERROR> {
    const initialState = this.getInitialState<ITEM, ERROR>(storeName, storage);
    this.addStoreReducerToNgrx<ITEM, ERROR>(storeName, initialState);
    const store = Injector.create({
      providers: [
        { provide: Store },
        { provide: NgrxStore, useValue: this.ngrxStore },
        { provide: StoreNameToken, useValue: storeName },
        { provide: DefaultStateToken, useValue: initialState },
      ],
    }).get(Store);

    this.storeStateChangesToClientStorage(storeName, store, storage);
    this.setStateFromExternalChanges<ITEM, ERROR>(storeName, store);
    store.destroy$.subscribe(() =>
      this.reducerManager.removeReducer(storeName)
    );
    return store;
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

  private getStorageByKey(
    storage?: storagePluginTypes
  ): ClientStoragePlugin | undefined {
    if (storage === 'sessionStoragePlugin') return this.sessionStoragePlugin;
    if (storage === 'localStoragePlugin') return this.localStoragePlugin;
    return;
  }

  private addStoreReducerToNgrx<ITEM, ERROR>(
    storeName: string,
    initialState: StoreState<ITEM, ERROR>
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

  private getActionReducer<ITEM, ERROR>(
    storeName: string,
    initialState: StoreState<ITEM, ERROR>
  ): ActionReducer<
    StoreState<ITEM, ERROR>,
    { payload: StoreState<ITEM, ERROR>; type: string }
  > {
    return (
      state: StoreState<ITEM, ERROR> = initialState,
      action: { payload: StoreState<ITEM, ERROR>; type: string }
    ): StoreState<ITEM, ERROR> =>
      action.type.startsWith(`[${storeName}]`)
        ? { ...state, ...action.payload }
        : state;
  }

  private storeStateChangesToClientStorage<ITEM, ERROR>(
    storeName: string,
    store: Store<ITEM, ERROR>,
    storage?: storagePluginTypes
  ) {
    store.state$.pipe(takeUntil(store.destroy$)).subscribe({
      next: (state) =>
        this.getStorageByKey(storage)?.setStateToStorage(storeName, state),
    });
  }

  private setStateFromExternalChanges<ITEM, ERROR>(
    storeName: string,
    store: Store<ITEM, ERROR>
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
