import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import {
  Action,
  ActionReducer,
  ReducerManager,
  ScannedActionsSubject,
} from '@ngrx/store';
import {
  INITIAL_OPTIONS,
  LiftedState,
  StoreDevtools,
  StoreDevtoolsConfig,
} from '@ngrx/store-devtools';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { ClientStoragePlugin } from '../models';
import { getCustomAction } from '../services/action-creator';
import { DevToolHelper } from './dev-tool-helper.service';
import { Store, getStoreState } from './store.service';
import { getDefaultComponentLoadingState } from './stores/component-loading-store.service';
import { ComponentStore } from './stores/component-store.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

interface MyState {
  myState: string;
  optionalValue?: string;
}

const defaultMyState: MyState = { myState: '' };

describe('Store', () => {
  const getStoreDevtoolsSpy = ({
    liftedState,
  }: {
    liftedState?: StoreDevtools['liftedState'];
  } = {}): SpyObj<StoreDevtools> =>
    jasmine.createSpyObj<StoreDevtools>(
      {
        sweep: undefined,
      },
      {
        liftedState: liftedState,
      },
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
    },
  );

  const getStore = (providers: TestModuleMetadata['providers'] = []): Store =>
    TestBed.configureTestingModule({
      providers: [
        Store,

        provideMockStore({
          initialState: {},
        }),

        {
          provide: ScannedActionsSubject,
          useValue: {},
        },
        {
          provide: ReducerManager,
          useValue: reducerManager,
        },

        ...providers,
      ],
      teardown: { destroyAfterEach: false },
    }).inject(Store);

  const createStoreByStoreType = (
    store: Store,
    payload: Parameters<Store['createStoreByStoreType']>[0],
  ) =>
    TestBed.runInInjectionContext(() => store.createStoreByStoreType(payload));

  it('should not show an Error for checkForTimeTravel', () => {
    expect(() => getStore().checkForTimeTravel()).not.toThrowError();
  });

  it('should not show an Error for addReducersForImportedState', () => {
    expect(() => getStore().addReducersForImportState()).not.toThrowError();
  });

  it('should create a componentStore without errors', () => {
    expect(() =>
      createStoreByStoreType(getStore(), {
        storeName: 'myStore',
        plugins: {},
        defaultState: defaultMyState,
        CreatedStore: ComponentStore,
      }),
    ).not.toThrowError();
  });

  it('should show warning Message if devtool maxAge is too low', () => {
    const spyWarn = spyOn(console, 'warn');
    getStore([
      {
        provide: INITIAL_OPTIONS,
        useValue: jasmine.createSpyObj<StoreDevtoolsConfig>({}, { maxAge: 4 }),
      },
    ]);

    expect(spyWarn).toHaveBeenCalledWith(
      'DevTool maxAge is set to a low value, please increase it to 5 or higher. This could lead to problems with the store.',
    );
  });

  it('should show error Message if @ngrx/store is not imported', () => {
    expect(() =>
      getStore([
        {
          provide: ReducerManager,
          useValue: undefined,
        },
      ]),
    ).toThrow(
      '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module',
    );
  });

  it('should set timeTravelActive to false', () => {
    const devToolHelper = jasmine.createSpyObj<DevToolHelper>('storeDevtools', {
      isTimeTravelActive: false,
      setTimeTravelActive: undefined,
    });

    const store = getStore([
      {
        provide: StoreDevtools,
        useValue: getStoreDevtoolsSpy({
          liftedState: of(
            jasmine.createSpyObj<LiftedState>(
              'liftedState',
              {},
              {
                currentStateIndex: 1,
                stagedActionIds: [1, 2, 3],
              },
            ),
          ),
        }),
      },
      { provide: DevToolHelper, useValue: devToolHelper },
    ]);

    store.checkForTimeTravel();

    expect(devToolHelper.setTimeTravelActive).toHaveBeenCalledWith(true);
  });

  it('should add new component reducers', () => {
    reducerManager.addReducer.calls.reset();
    const getLiftestState = (
      monitorState: LiftedState['monitorState'],
    ): SpyObj<LiftedState> =>
      createSpyObj<LiftedState>(
        {},
        {
          monitorState: monitorState,
        },
      );
    const storeDevtools = jasmine.createSpyObj<StoreDevtools>(
      'storeDevtools',
      {
        sweep: undefined,
      },
      {
        liftedState: of(
          getLiftestState(null),
          getLiftestState({
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
                    type: getCustomAction({
                      storeName: 'NEW_STORE',
                    }).type,
                  },
                },
              },
            },
          }),
        ),
      },
    );
    const store = getStore([
      { provide: StoreDevtools, useValue: getStoreDevtoolsSpy() },
      {
        provide: StoreDevtools,
        useValue: storeDevtools,
      },
    ]);

    store.addReducersForImportState();

    expect(reducerManager.addReducers).toHaveBeenCalledWith({
      NEW_STORE: jasmine.any(Function),
    });

    expect(storeDevtools.sweep).toHaveBeenCalled();
  });

  it('should show hint for multiple store initialisations', () => {
    const store = getStore([]);
    const info = spyOn(console, 'info');

    createStoreByStoreType(store, {
      storeName: 'my-store',
      defaultState: {},
      CreatedStore: ComponentStore,
    });
    createStoreByStoreType(store, {
      storeName: 'my-store',
      defaultState: {},
      CreatedStore: ComponentStore,
    });

    expect(info).toHaveBeenCalledWith(
      "A Store with name 'my-store' is currently running, check if you missed to implement ngOnDestroy for this store",
    );
  });

  it('should return default initial state', () => {
    const { state } = createStoreByStoreType(getStore(), {
      storeName: 'myStore',
      plugins: {},
      defaultState: defaultMyState,
      CreatedStore: ComponentStore,
    });

    expect(state()).toEqual(defaultMyState);
  });

  it('should return state from sessionStorage plugin', () => {
    const store = getStore([
      {
        provide: LocalStoragePlugin,
        useValue: jasmine.createSpyObj<ClientStoragePlugin>({
          getDefaultState: <MyState>{
            myState: '',
            optionalValue: 'testDataFromLocalStorage',
          },
          setStateToStorage: undefined,
        }),
      },
    ]);
    const { state } = createStoreByStoreType(store, {
      storeName: 'myStore',
      defaultState: defaultMyState,
      plugins: {
        storage: 'localStoragePlugin',
      },
      CreatedStore: ComponentStore,
    });

    expect(state()).toEqual({
      ...defaultMyState,
      optionalValue: 'testDataFromLocalStorage',
    });
  });

  describe('ngrxStore', () => {
    it('should add add for store', () => {
      reducerManager.addReducer.calls.reset();

      createStoreByStoreType(getStore(), {
        storeName: 'testStore',
        defaultState: defaultMyState,
        CreatedStore: ComponentStore,
      });

      expect(reducerManager.addReducer.calls.argsFor(0)[0]).toBe('testStore');
    });

    it('should not add an existing reducer to store', () => {
      reducerManager.addReducer.calls.reset();

      createStoreByStoreType(getStore(), {
        storeName: 'oldStore',
        defaultState: defaultMyState,
        CreatedStore: ComponentStore,
      });

      expect(reducerManager.addReducer).not.toHaveBeenCalled();
    });

    describe('add state to ngrx/store', () => {
      let actionReducer: ActionReducer<unknown, Action>;
      beforeEach(() => {
        reducerManager.addReducer.and.callFake((name, callback) => {
          actionReducer = callback;
        });
      });
      it('should ignore action from other store', () => {
        createStoreByStoreType(getStore(), {
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
            }),
          ),
        ).toEqual({});
      });

      describe('action is current store action', () => {
        it('should set payload', () => {
          createStoreByStoreType(getStore(), {
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
              }),
            ),
          ).toEqual({ isLoading: true });
        });

        it('should return merge default state with payload', () => {
          createStoreByStoreType(getStore(), {
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
              }),
            ),
          ).toEqual(defaultMyState);
        });
      });
    });

    describe('set state from storeDevtools', () => {
      let store: Store;
      beforeEach(() => {
        store = getStore([
          {
            provide: DevToolHelper,
            useValue: jasmine.createSpyObj<DevToolHelper>('storeDevtools', {
              isTimeTravelActive: true,
              setTimeTravelActive: undefined,
            }),
          },

          {
            provide: StoreDevtools,
            useValue: getStoreDevtoolsSpy({
              liftedState: cold('a', {
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
              }),
            }),
          },
        ]);
      });

      it('should set stateChanges to store', () => {
        const { state$ } = createStoreByStoreType(store, {
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
          }),
        );
      });

      it('should not set stateChanges to store for stores with skipLog option', () => {
        const { state$ } = createStoreByStoreType(store, {
          storeName: 'myStore',
          defaultState: defaultMyState,
          CreatedStore: ComponentStore,
          skipLogForStore: true,
        });

        expect(state$).toBeObservable(
          cold('a', {
            a: defaultMyState,
          }),
        );
      });
    });

    describe('store state changes to ClientStoragePlugins', () => {
      it('should return state from sessionStorage plugin', () => {
        const store = getStore([
          {
            provide: SessionStoragePlugin,
            useValue: jasmine.createSpyObj<ClientStoragePlugin>({
              getDefaultState: <MyState>{
                myState: '',
                optionalValue: 'testDataFromSessionStorage',
              },
              setStateToStorage: undefined,
            }),
          },
        ]);
        const { state } = createStoreByStoreType(store, {
          storeName: 'myStore',
          defaultState: defaultMyState,
          plugins: {
            storage: 'sessionStoragePlugin',
          },
          CreatedStore: ComponentStore,
        });

        expect(state()).toEqual({
          ...defaultMyState,
          optionalValue: 'testDataFromSessionStorage',
        });
      });

      it('should store changes to session storage', () => {
        const sessionStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>({
          getDefaultState: <MyState>{
            myState: '',
            optionalValue: 'testDataFromSessionStorage',
          },
          setStateToStorage: undefined,
        });
        const store = getStore([
          {
            provide: SessionStoragePlugin,
            useValue: sessionStoragePlugin,
          },
        ]);
        const createdStore = createStoreByStoreType(store, {
          storeName: 'testStore',
          defaultState: defaultMyState,
          plugins: {
            storage: 'sessionStoragePlugin',
          },
          CreatedStore: ComponentStore,
        });

        createdStore.setState({ ...defaultMyState, myState: 'test' });

        expect(sessionStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
          'testStore',
          { ...defaultMyState, myState: 'test' },
        );
      });

      it('should store changes to localStorage storage', () => {
        const localStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>({
          getDefaultState: <MyState>{
            myState: '',
            optionalValue: 'testDataFromSessionStorage',
          },
          setStateToStorage: undefined,
        });

        const store = getStore([
          {
            provide: LocalStoragePlugin,
            useValue: localStoragePlugin,
          },
        ]);
        const myStore = createStoreByStoreType(store, {
          storeName: 'testStore',
          defaultState: defaultMyState,
          plugins: {
            storage: 'localStoragePlugin',
          },
          CreatedStore: ComponentStore,
        });

        myStore.setState({ ...defaultMyState, myState: 'test' });

        expect(localStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
          'testStore',
          { ...defaultMyState, myState: 'test' },
        );
      });
    });

    describe('remove reducer, after destroy', () => {
      describe('devtools are available', () => {
        const getComponentStore = (storeDevTools: StoreDevtools) => {
          const store = getStore([
            { provide: StoreDevtools, useValue: storeDevTools },
          ]);
          return createStoreByStoreType(store, {
            storeName: 'testStore',
            defaultState: defaultMyState,
            CreatedStore: ComponentStore,
          });
        };
        beforeEach(() => {
          reducerManager.removeReducer.calls.reset();
        });
        it('should not remove the reducer, when store actions included in the liftedState', () => {
          const storeDevtools = getStoreDevtoolsSpy({
            liftedState: cold('a', {
              a: <Partial<LiftedState>>{
                actionsById: {
                  [1]: {
                    type: 'PERFORM_ACTION',
                    action: {
                      type: getCustomAction({ storeName: 'testStore' }).type,
                    },
                  },
                },
              },
            }),
          });

          const component = getComponentStore(storeDevtools);

          component.ngOnDestroy();
          getTestScheduler().run(({ flush }) => {
            flush();
            expect(reducerManager.removeReducer).not.toHaveBeenCalled();
          });
        });

        it('should remove the reducer, when no store actions included in the liftedState', () => {
          const storeDevtools = getStoreDevtoolsSpy({
            liftedState: cold('a', {
              a: <Partial<LiftedState>>{
                actionsById: {
                  [1]: {
                    type: 'PERFORM_ACTION',
                    action: {
                      type: getCustomAction({ storeName: 'otherStore' }).type,
                    },
                  },
                },
              },
            }),
          });
          const component = getComponentStore(storeDevtools);

          component.ngOnDestroy();
          getTestScheduler().run(({ flush }) => {
            flush();
            expect(reducerManager.removeReducer).toHaveBeenCalledWith(
              'testStore',
            );
            expect(storeDevtools.sweep).toHaveBeenCalled();
          });
        });
      });

      it('should immediately remove the reducer, when devtools are not available', () => {
        TestBed.overrideProvider(StoreDevtools, { useValue: null });

        const myStore = createStoreByStoreType(getStore(), {
          storeName: 'testStore',
          defaultState: defaultMyState,
          CreatedStore: ComponentStore,
        });
        myStore.ngOnDestroy();

        expect(reducerManager.removeReducer).toHaveBeenCalledWith('testStore');
      });
    });
  });
});

describe('getStoreState', () => {
  it('should return state', () => {
    const store = jasmine.createSpyObj<ComponentStore<{ myState: string }>>(
      'Store',
      { state: { myState: '' } },
      {},
    );
    expect(getStoreState(store)).toEqual({ myState: '' });
  });

  it('should return state', () => {
    class Store {
      get state() {
        throw 'error';
      }
    }

    expect(
      getStoreState(new Store() as unknown as ComponentStore<{ myState: '' }>),
    ).toBeUndefined();
  });
});
