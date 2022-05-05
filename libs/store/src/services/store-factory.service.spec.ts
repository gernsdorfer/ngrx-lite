import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin, LoadingStoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import { getDefaultLoadingState } from '../services/loading-store.service';
import { getCustomAction } from '../services/action-creator';
import { Action, ActionReducer } from '@ngrx/store/src/models';

interface MyState {
  myState: string;
  optionalValue?: string;
}

const defaultMyState: MyState = { myState: '' };

describe('StoreFactory', () => {
  const sessionStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'SessionStoragePlugin',
    {
      getDefaultState: <MyState>({myState: ''}),
      setStateToStorage: undefined,
    }
  );
  const localStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'LocalStoragePlugin',
    {
      getDefaultState: <MyState>({myState: ''}),
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
  let storeFactory: StoreFactory;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreFactory,
        {
          provide: SessionStoragePlugin,
          useValue: sessionStoragePlugin,
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
    storeFactory = TestBed.inject(StoreFactory);
    mockStore = TestBed.inject(MockStore);
  });

  describe('createStore', () => {
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
        const { state } = storeFactory.createComponentStore<MyState>({
          storeName: 'myStore',
          defaultState: defaultMyState,
        });

        expect(state).toEqual(defaultMyState);
      });

      it('should return state from sessionStorage plugin', () => {
        const { state } = storeFactory.createComponentStore<MyState>({
          storeName: 'myStore',
          defaultState: defaultMyState,
          plugins: {
            storage: 'sessionStoragePlugin',
          },
        });

        expect(state).toEqual({
          ...defaultMyState,
          optionalValue: 'testDataFromSessionStorage',
        });
      });

      it('should return state from localeStorage plugin', () => {
        const { state } = storeFactory.createComponentStore<MyState>({
          storeName: 'myStore',
          defaultState: defaultMyState,
          plugins: {
            storage: 'localStoragePlugin',
          },
        });

        expect(state).toEqual({
          ...defaultMyState,
          optionalValue: 'testDataFromLocalStorage',
        });
      });
    });
  });

  describe('createStore', () => {
    describe('initialState', () => {
      beforeEach(() => {
        localStoragePlugin.getDefaultState.and.returnValue({
          ...getDefaultLoadingState(),
          item: 'defaultValueFromSessionStore',
        });
        sessionStoragePlugin.getDefaultState.and.returnValue({
          ...getDefaultLoadingState(),
          item: 'defaultValueFromLocalStore',
        });
      });

      it('should return default initial state', () => {
        const { state } = storeFactory.createStore<string, number>('testStore');

        expect(state).toEqual(getDefaultLoadingState());
      });

      it('should return state from sessionStorage plugin', () => {
        const { state } = storeFactory.createStore<string, number>(
          'testStore',
          {
            storage: 'sessionStoragePlugin',
          }
        );

        expect(state).toEqual({
          ...getDefaultLoadingState(),
          item: 'defaultValueFromLocalStore',
        });
      });

      it('should return state from localeStorage plugin', () => {
        const { state } = storeFactory.createStore<string, number>(
          'testStore',
          {
            storage: 'localStoragePlugin',
          }
        );

        expect(state).toEqual({
          ...getDefaultLoadingState(),
          item: 'defaultValueFromSessionStore',
        });
      });
    });
  });

  describe('ngrxStore', () => {
    describe('add store to reducerManager', () => {
      it('should add addReducer for store', () => {
        reducerManager.addReducer.calls.reset();

        storeFactory.createStore<string, number>('testStore');

        expect(reducerManager.addReducer.calls.argsFor(0)[0]).toBe('testStore');
      });

      it('should warn for override store', () => {
        const spyWarn = spyOn(console, 'warn');
        storeFactory.createStore<string, number>('oldStore');

        expect(spyWarn).toHaveBeenCalledWith(
          'store oldStore exists, changes will be override. Please destroy your store or rename it before create a new one'
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
        storeFactory.createStore<string, never>('testStore');

        expect(
          actionReducer(
            {},
            getCustomAction({
              actionName: 'myAction',
              storeName: 'otherStore',
            })({
              payload: {
                ...getDefaultLoadingState(),
              },
            })
          )
        ).toEqual({});
      });

      describe('action is current store action', () => {
        it('should merge state with payload', () => {
          storeFactory.createStore<string, never>('testStore');

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
          storeFactory.createStore<string, never>('testStore');

          expect(
            actionReducer(
              undefined,
              getCustomAction({
                actionName: 'LOAD',
                storeName: 'testStore',
              })({
                payload: { isLoading: true, item: 'test' },
              })
            )
          ).toEqual({
            ...getDefaultLoadingState(),
            isLoading: true,
            item: 'test',
          });
        });
      });
    });

    describe('set state from ngrx/store', () => {
      describe('ngrx/Store change is current store', () => {
        it('should set state from ngrx/store', () => {
          const store = storeFactory.createStore<string, never>('testStore');
          mockStore.setState({
            testStore: <LoadingStoreState<string, never>>{
              isLoading: false,
              item: 'testValue',
            },
          });

          expect(store.state).toEqual(<LoadingStoreState<string, never>>{
            isLoading: false,
            item: 'testValue',
          });
        });

        it('should log setState to avoid deduplicate actions', () => {
          const store = storeFactory.createStore<string, never>('testStore');
          const setStateSpy = spyOn(store, 'setState');

          mockStore.setState({
            testStore: <LoadingStoreState<string, never>>{
              isLoading: false,
              item: 'testValue',
            },
          });

          expect(setStateSpy).toHaveBeenCalledWith(
            {
              isLoading: false,
              item: 'testValue',
            },
            '',
            true
          );
        });
      });

      it('should ignore other store', () => {
        const store = storeFactory.createStore<string, never>('testStore');

        mockStore.setState({
          otherStore: <LoadingStoreState<string, never>>{
            isLoading: false,
            item: 'testValue',
          },
        });

        expect(store.state).toEqual(getDefaultLoadingState());
      });
    });

    it('should removeReducer after destroy the store', () => {
      const myStore = storeFactory.createStore<string, number>('myStory');
      reducerManager.removeReducer.calls.reset();

      myStore.ngOnDestroy();

      expect(reducerManager.removeReducer).toHaveBeenCalledWith('myStory');
    });
  });

  describe('store state changes to ClientStoragePlugins', () => {
    it('should store changes to session storage', () => {
      const store = storeFactory.createStore<string, never>('myStore', {
        storage: 'sessionStoragePlugin',
      });

      sessionStoragePlugin.setStateToStorage.calls.reset();
      store.setState({ isLoading: true, item: 'test' });

      expect(sessionStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
        'myStore',
        { isLoading: true, item: 'test' }
      );
    });

    it('should store changes to localStorage storage', () => {
      const store = storeFactory.createStore<string, never>('myStore', {
        storage: 'localStoragePlugin',
      });

      localStoragePlugin.setStateToStorage.calls.reset();
      store.setState({ isLoading: true, item: 'test' });

      expect(localStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
        'myStore',
        { isLoading: true, item: 'test' }
      );
    });
  });
});

describe('ngrx/Store is not imported ', () => {
  it('should show error Message if @ngrx/store is not imported', () => {
    console.log();
    expect(() => TestBed.inject(StoreFactory)).toThrow(
      '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module'
    );
  });
});
