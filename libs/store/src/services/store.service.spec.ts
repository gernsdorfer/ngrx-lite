import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import { getDefaultComponentLoadingState } from './stores/component-loading-store.service';
import { getCustomAction } from '../services/action-creator';
import { Action, ActionReducer } from '@ngrx/store/src/models';
import { cold } from 'jasmine-marbles';
import { StoreDevtools } from '@ngrx/store-devtools';
import { defer, EMPTY, of } from 'rxjs';
import { LiftedState } from '@ngrx/store-devtools/src/reducer';
import {
  ComponentStore,
  DevToolHelper,
} from './stores/component-store.service';
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
    {
      sweep: undefined,
    },
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
    {
      addReducer: undefined,
      addReducers: undefined,
      removeReducer: undefined,
    },
    {
      currentReducers: {
        oldStore: () => undefined,
      },
    }
  );
  const getStore = (): Store => TestBed.inject(Store);

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
    });

    it('should not show an Error for checkForTimeTravel', () => {
      const store = TestBed.inject(Store);
      expect(() => store.checkForTimeTravel()).not.toThrowError();
    });

    it('should not show an Error for addReducersForImportedState', () => {
      const store = TestBed.inject(Store);
      expect(() => store.addReducersForImportState()).not.toThrowError();
    });

    it('should create a componentStore without errors', () => {
      const store = TestBed.inject(Store);

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
    });

    describe('checkForTimeTravel', () => {
      it('should set setCanChangeState to false', () => {
        liftedState$ = of(
          jasmine.createSpyObj<LiftedState>(
            'liftedState',
            {},
            {
              currentStateIndex: 1,
              stagedActionIds: [1, 2, 3],
            }
          )
        );

        devToolHelper.setCanChangeState.calls.reset();

        getStore().checkForTimeTravel();

        expect(devToolHelper.setCanChangeState).toHaveBeenCalledWith(false);
      });
    });

    describe('addReducersForImportState', () => {
      it('should set setCanChangeState to false', () => {
        liftedState$ = of(
          jasmine.createSpyObj<LiftedState>(
            'liftedState',
            {},
            {
              monitorState: <Partial<LiftedState>>{
                type: 'IMPORT_STATE',
                nextLiftedState: {
                  stagedActionIds: [1, 2, 3],
                  actionsById: {
                    1: {
                      type: 'PERFORM_ACTION',
                      action: {
                        type: 'otherStore',
                      },
                    },
                    2: {
                      type: 'PERFORM_ACTION',
                      action: {
                        type: getCustomAction({ storeName: 'oldStore' }).type,
                      },
                    },
                    3: {
                      type: 'PERFORM_ACTION',
                      action: {
                        type: getCustomAction({ storeName: 'NEW_STORE' }).type,
                      },
                    },
                  },
                },
              },
            }
          )
        );

        reducerManager.addReducer.calls.reset();

        getStore().addReducersForImportState();

        expect(reducerManager.addReducers).toHaveBeenCalledWith({
          NEW_STORE: jasmine.any(Function),
        });

        expect(storeDevtools.sweep).toHaveBeenCalled();
      });
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
          const { state } = getStore().createStoreByStoreType({
            storeName: 'myStore',
            plugins: {},
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(state).toEqual(defaultMyState);
        });

        it('should return state from sessionStorage plugin', () => {
          const { state } = getStore().createStoreByStoreType({
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
          const { state } = getStore().createStoreByStoreType({
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
        it('should add add for store', () => {
          reducerManager.addReducer.calls.reset();

          getStore().createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(reducerManager.addReducer.calls.argsFor(0)[0]).toBe(
            'testStore'
          );
        });
        it('should not add an existing reducer to store', () => {
          reducerManager.addReducer.calls.reset();

          getStore().createStoreByStoreType({
            storeName: 'oldStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });

          expect(reducerManager.addReducer).not.toHaveBeenCalled();
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
          getStore().createStoreByStoreType({
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
            getStore().createStoreByStoreType({
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
            getStore().createStoreByStoreType({
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
          const { state$ } = getStore().createStoreByStoreType({
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
          const myStore = getStore().createStoreByStoreType({
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
          const myStore = getStore().createStoreByStoreType({
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

      describe('remove reducer, after destroy', () => {
        it('should not remove the reducer, when devtools are availible', () => {
          reducerManager.removeReducer.calls.reset();

          const myStore = getStore().createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });
          myStore.ngOnDestroy();

          expect(reducerManager.removeReducer).not.toHaveBeenCalled();
        });

        it('should not remove the reducer, when devtools are availible', () => {
          TestBed.overrideProvider(StoreDevtools, { useValue: null });

          const myStore = getStore().createStoreByStoreType({
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });
          myStore.ngOnDestroy();

          expect(reducerManager.removeReducer).toHaveBeenCalled();
        });
      });
    });
  });

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

    expect(() => getStore()).toThrow(
      '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module'
    );
  });
});

