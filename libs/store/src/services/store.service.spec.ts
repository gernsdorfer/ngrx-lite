import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import { getDefaultComponentLoadingState } from './component-loading-store.service';
import { getCustomAction } from '../services/action-creator';
import { Action, ActionReducer } from '@ngrx/store/src/models';
import { cold } from 'jasmine-marbles';
import { StoreDevtools } from '@ngrx/store-devtools';
import { defer, EMPTY } from 'rxjs';
import { LiftedState } from '@ngrx/store-devtools/src/reducer';
import { ComponentStore, DevToolHelper } from './component-store.service';
import { Store } from './store.service';

interface MyState {
  myState: string;
  optionalValue?: string;
}

const defaultMyState: MyState = { myState: '' };

describe('Store', () => {
  const sessionStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'SessionStoragePlugin',
    {
      getDefaultState: <MyState>{ myState: '' },
      setStateToStorage: undefined,
    }
  );
  let liftedState$: StoreDevtools['liftedState'] = EMPTY;
  const storeDevtools = jasmine.createSpyObj<StoreDevtools>(
    'storeDevtools',
    {},
    {
      liftedState: defer(() => liftedState$),
    }
  );
  const devToolHelper = jasmine.createSpyObj<DevToolHelper>('storeDevtools', {
    canChangeState: true,
    setCanChangeState: undefined,
  });
  const localStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'LocalStoragePlugin',
    {
      getDefaultState: <MyState>{ myState: '' },
      setStateToStorage: undefined,
    }
  );
  const reducerManager = jasmine.createSpyObj<ReducerManager>(
    'ReducerManager',
    { addReducer: undefined, removeReducer: undefined },
    {
      currentReducers: {
        oldStore: () => undefined,
      },
    }
  );
  let store: Store;

  describe('minimal Dependencies are available', () => {
    beforeEach(() => {
      devToolHelper.canChangeState.and.returnValue(true);
      liftedState$ = EMPTY;
      TestBed.configureTestingModule({
        providers: [
          Store,

          provideMockStore({
            initialState: {},
          }),
          {
            provide: DevToolHelper,
            useValue: devToolHelper,
          },
          {
            provide: ReducerManager,
            useValue: reducerManager,
          },
        ],
        teardown: { destroyAfterEach: false },
      });
      store = TestBed.inject(Store);
    });

    it('should create a componentStore without errors', () => {
      expect(() =>
        store.createStoreByStoreType({
          storeName: 'myStore',
          plugins: {},
          defaultState: defaultMyState,
          CreatedStore: ComponentStore,
        })
      ).not.toThrowError();
    });
  });

  describe('All Dependencies are available', () => {
    beforeEach(() => {
      devToolHelper.canChangeState.and.returnValue(true);
      liftedState$ = EMPTY;
      TestBed.configureTestingModule({
        providers: [
          Store,
          {
            provide: SessionStoragePlugin,
            useValue: sessionStoragePlugin,
          },
          {
            provide: DevToolHelper,
            useValue: devToolHelper,
          },
          {
            provide: StoreDevtools,
            useValue: storeDevtools,
          },
          {
            provide: LocalStoragePlugin,
            useValue: localStoragePlugin,
          },
          provideMockStore({
            initialState: {},
          }),
          {
            provide: ReducerManager,
            useValue: reducerManager,
          },
        ],
        teardown: { destroyAfterEach: false },
      });
      store = TestBed.inject(Store);
    });

    describe('createStoreByStoreType', () => {
      describe('initialState', () => {
        beforeEach(() => {
          localStoragePlugin.getDefaultState.and.returnValue(<MyState>{
            ...defaultMyState,
            optionalValue: 'testDataFromLocalStorage',
          });
          sessionStoragePlugin.getDefaultState.and.returnValue(<MyState>{
            ...defaultMyState,
            optionalValue: 'testDataFromSessionStorage',
          });
        });

        it('should return default initial state', () => {
          const { state } = store.createStoreByStoreType({
            storeName: 'myStore',
            plugins: {},
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(state).toEqual(defaultMyState);
        });

        it('should return state from sessionStorage plugin', () => {
          const { state } = store.createStoreByStoreType({
            storeName: 'myStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'sessionStoragePlugin',
            },
            CreatedStore: ComponentStore,
          });

          expect(state).toEqual({
            ...defaultMyState,
            optionalValue: 'testDataFromSessionStorage',
          });
        });

        it('should return state from localeStorage plugin', () => {
          const { state } = store.createStoreByStoreType({
            storeName: 'myStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'localStoragePlugin',
            },
            CreatedStore: ComponentStore,
          });

          expect(state).toEqual({
            ...defaultMyState,
            optionalValue: 'testDataFromLocalStorage',
          });
        });
      });
    });

    describe('ngrxStore', () => {
      describe('add store to reducerManager', () => {
        it('should add addReducer for store', () => {
          reducerManager.addReducer.calls.reset();

          store.createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(reducerManager.addReducer.calls.argsFor(0)[0]).toBe(
            'testStore'
          );
        });
      });

      describe('add state to ngrx/store', () => {
        let actionReducer: ActionReducer<unknown, Action>;
        beforeEach(() => {
          reducerManager.addReducer.and.callFake((name, callback) => {
            actionReducer = callback;
          });
        });
        it('should ignore action from other store', () => {
          store.createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(
            actionReducer(
              {},
              getCustomAction({
                actionName: 'myAction',
                storeName: 'otherStore',
              })({
                payload: {
                  ...getDefaultComponentLoadingState(),
                },
              })
            )
          ).toEqual({});
        });

        describe('action is current store action', () => {
          it('should merge state with payload', () => {
            store.createStoreByStoreType({
              storeName: 'testStore',
              defaultState: defaultMyState,
              CreatedStore: ComponentStore,
            });

            expect(
              actionReducer(
                { item: 'test' },
                getCustomAction({
                  actionName: 'LOAD',
                  storeName: 'testStore',
                })({
                  payload: { isLoading: true },
                })
              )
            ).toEqual({ isLoading: true, item: 'test' });
          });

          it('should return merge default state with payload', () => {
            store.createStoreByStoreType({
              storeName: 'testStore',
              defaultState: defaultMyState,
              CreatedStore: ComponentStore,
            });

            expect(
              actionReducer(
                undefined,
                getCustomAction({
                  actionName: 'LOAD',
                  storeName: 'testStore',
                })({
                  payload: defaultMyState,
                })
              )
            ).toEqual(defaultMyState);
          });
        });
      });

      describe('set state from storeDevtools', () => {
        it('should set stateChanges to store', () => {
          devToolHelper.canChangeState.and.returnValue(false);
          liftedState$ = cold('a', {
            a: <Partial<LiftedState>>{
              computedStates: [
                {
                  state: {
                    myStore: <MyState>{
                      ...defaultMyState,
                      myState: 'newValue',
                    },
                  },
                },
              ],
              currentStateIndex: 0,
              stagedActionIds: [0, 1, 2],
            },
          });
          const { state$ } = store.createStoreByStoreType({
            storeName: 'myStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(state$).toBeObservable(
            cold('a', {
              a: {
                ...defaultMyState,
                myState: 'newValue',
              },
            })
          );
        });
      });

      describe('store state changes to ClientStoragePlugins', () => {
        it('should store changes to session storage', () => {
          const myStore = store.createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'sessionStoragePlugin',
            },
            CreatedStore: ComponentStore,
          });

          sessionStoragePlugin.setStateToStorage.calls.reset();
          myStore.setState({ ...defaultMyState, myState: 'test' });

          expect(sessionStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
            'testStore',
            { ...defaultMyState, myState: 'test' }
          );
        });

        it('should store changes to localStorage storage', () => {
          const myStore = store.createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'localStoragePlugin',
            },
            CreatedStore: ComponentStore,
          });

          localStoragePlugin.setStateToStorage.calls.reset();

          myStore.setState({ ...defaultMyState, myState: 'test' });

          expect(localStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
            'testStore',
            { ...defaultMyState, myState: 'test' }
          );
        });
      });
    });
  });

  describe('ngrx/Store is not imported ', () => {
    it('should show error Message if @ngrx/store is not imported', () => {
      TestBed.configureTestingModule({
        providers: [
          Store,

          {
            provide: DevToolHelper,
            useValue: devToolHelper,
          },
        ],
        teardown: { destroyAfterEach: false },
      });

      expect(() => TestBed.inject(Store)).toThrow(
        '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module'
      );
    });
  });
});

