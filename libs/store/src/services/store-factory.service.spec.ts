import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import { getCustomAction, getDefaultState } from '@gernsdorfer/ngrx-lite';
import { Action, ActionReducer } from '@ngrx/store/src/models';

describe('StoreFactory', () => {
  const sessionStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'SessionStoragePlugin',
    {
      getDefaultState: getDefaultState(),
      setStateToStorage: undefined,
    }
  );
  const localStoragePlugin = jasmine.createSpyObj<ClientStoragePlugin>(
    'LocalStoragePlugin',
    {
      getDefaultState: getDefaultState(),
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

  describe('initialState', () => {
    beforeEach(() => {
      localStoragePlugin.getDefaultState.and.returnValue({
        ...getDefaultState(),
        item: 'defaultValueFromSessionStore',
      });
      sessionStoragePlugin.getDefaultState.and.returnValue({
        ...getDefaultState(),
        item: 'defaultValueFromLocalStore',
      });
    });

    it('should return default initial state', () => {
      const { state } = storeFactory.createStore<string, number>('testStore');

      expect(state).toEqual(getDefaultState());
    });

    it('should return state from sessionStorage plugin', () => {
      const { state } = storeFactory.createStore<string, number>('testStore', {
        storage: 'sessionStoragePlugin',
      });

      expect(state).toEqual({
        ...getDefaultState(),
        item: 'defaultValueFromLocalStore',
      });
    });

    it('should return state from localeStorage plugin', () => {
      const { state } = storeFactory.createStore<string, number>('testStore', {
        storage: 'localStoragePlugin',
      });

      expect(state).toEqual({
        ...getDefaultState(),
        item: 'defaultValueFromSessionStore',
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
                ...getDefaultState(),
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
          ).toEqual({ ...getDefaultState(), isLoading: true, item: 'test' });
        });
      });
    });

    describe('set state from ngrx/store', () => {
      describe('ngrx/Store change is current store', () => {
        it('should set state from ngrx/store', () => {
          const store = storeFactory.createStore<string, never>('testStore');
          mockStore.setState({
            testStore: <StoreState<string, never>>{
              isLoading: false,
              item: 'testValue',
            },
          });

          expect(store.state).toEqual(<StoreState<string, never>>{
            isLoading: false,
            item: 'testValue',
          });
        });

        it('should log setState to avoid deduplicate actions', () => {
          const store = storeFactory.createStore<string, never>('testStore');
          const setStateSpy = spyOn(store, 'setState');

          mockStore.setState({
            testStore: <StoreState<string, never>>{
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
          otherStore: <StoreState<string, never>>{
            isLoading: false,
            item: 'testValue',
          },
        });

        expect(store.state).toEqual(getDefaultState());
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
