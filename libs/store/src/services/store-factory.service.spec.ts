import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import {
  EffectStates,
  getCustomAction,
  getDefaultState,
  getEffectAction,
} from '@gernsdorfer/ngrx-lite';
import { Action, ActionReducer } from '@ngrx/store/src/models';
import { cold } from 'jasmine-marbles';
import Spy = jasmine.Spy;

interface MyTestModel {
  name: string;
}

interface MyErrorState {
  message: string;
}

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
      ].filter((provider) => provider),
      teardown: { destroyAfterEach: false },
    });
    storeFactory = TestBed.inject(StoreFactory);
    mockStore = TestBed.inject(MockStore);
  });

  describe('initialState', () => {
    beforeEach(() => {
      localStoragePlugin.getDefaultState.and.returnValue({
        ...getDefaultState(),
        item: { name: 'defaultValueFromSessionStore' },
      });
      sessionStoragePlugin.getDefaultState.and.returnValue({
        ...getDefaultState(),
        item: { name: 'defaultValueFromLocalStore' },
      });
    });

    it('should return default initial state', () => {
      const { state } = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore'
      );

      expect(state).toEqual(getDefaultState());
    });

    it('should return state from sessionStorage plugin', () => {
      const { state } = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore',
        {
          storage: 'sessionStoragePlugin',
        }
      );

      expect(state).toEqual({
        ...getDefaultState(),
        item: { name: 'defaultValueFromLocalStore' },
      });
    });

    it('should return state from localeStorage plugin', () => {
      const { state } = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore',
        {
          storage: 'localStoragePlugin',
        }
      );

      expect(state).toEqual({
        ...getDefaultState(),
        item: { name: 'defaultValueFromSessionStore' },
      });
    });
  });

  describe('ngrxStore', () => {
    describe('add store to reducerManager', () => {
      it('should add addReducer for store', () => {
        reducerManager.addReducer.calls.reset();

        storeFactory.createStore<MyTestModel, MyErrorState>('testStore');

        expect(reducerManager.addReducer.calls.argsFor(0)[0]).toBe('testStore');
      });

      it('should warn for override store', () => {
        const spyWarn = spyOn(console, 'warn');
        storeFactory.createStore<MyTestModel, MyErrorState>('oldStore');

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
        storeFactory.createStore<MyTestModel, never>('testStore');

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
      const myStore = storeFactory.createStore<MyTestModel, MyErrorState>(
        'myStory'
      );
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

  describe('store', () => {
    let mockStoreDispatch: Spy;
    beforeEach(() => {
      mockStoreDispatch = spyOn(mockStore, 'dispatch');
    });
    const getDispatchAction = <ITEM, ERROR>({
      storeName,
      actionName,
      storeState,
    }: {
      storeName: string;
      actionName: string;
      storeState: StoreState<ITEM, ERROR>;
    }) =>
      getCustomAction({ storeName, actionName })({
        payload: {
          ...getDefaultState,
          item: undefined,
          error: undefined,
          ...storeState,
        },
      });

    it('should send init action after create', () => {
      storeFactory.createStore('myTestStore');

      expect(mockStoreDispatch).toHaveBeenCalledWith(
        getDispatchAction({
          storeName: 'myTestStore',
          actionName: 'init',
          storeState: getDefaultState(),
        })
      );
    });

    describe('state', () => {
      it('should return state from store', () => {
        const { state } = storeFactory.createStore('myStore');
        expect(state).toEqual(getDefaultState());
      });
    });

    describe('setState', () => {
      it('should set state to store with object', () => {
        const store = storeFactory.createStore('myStore');

        store.setState({ isLoading: true, item: 'test' });

        expect(store.state).toEqual({ isLoading: true, item: 'test' });
      });

      it('should set state to store with function', () => {
        const store = storeFactory.createStore('myStore');

        store.setState((state) => ({ ...state, item: 'test' }));

        expect(store.state).toEqual({ isLoading: false, item: 'test' });
      });

      it('should dispatch action with default actionName `SET_STATE`', () => {
        const store = storeFactory.createStore('myStore');

        mockStoreDispatch.calls.reset();
        store.setState({ isLoading: true, item: 'test' });

        expect(mockStoreDispatch).toHaveBeenCalledWith(
          getDispatchAction({
            storeName: 'myStore',
            actionName: 'SET_STATE',
            storeState: { isLoading: true, item: 'test' },
          })
        );
      });

      it('should dispatch action with custom actionName', () => {
        const store = storeFactory.createStore('myStore');

        mockStoreDispatch.calls.reset();
        store.setState({ isLoading: true, item: 'test' }, 'myCustomAction');

        expect(mockStoreDispatch).toHaveBeenCalledWith(
          getDispatchAction({
            storeName: 'myStore',
            actionName: 'myCustomAction',
            storeState: { isLoading: true, item: 'test' },
          })
        );
      });

      it('should not dispatch action for skipLog', () => {
        const store = storeFactory.createStore('myStore');

        mockStoreDispatch.calls.reset();
        store.setState(
          { isLoading: true, item: 'test' },
          'myCustomAction',
          true
        );

        expect(mockStoreDispatch).not.toHaveBeenCalled();
      });
    });

    describe('patchState', () => {
      it('should set state to store with object', () => {
        const store = storeFactory.createStore('myStore');

        store.patchState({ item: 'test' });

        expect(store.state).toEqual({ isLoading: false, item: 'test' });
      });

      it('should set state to store with function', () => {
        const store = storeFactory.createStore('myStore');

        store.patchState((state) => ({ ...state, item: 'test' }));

        expect(store.state).toEqual({ isLoading: false, item: 'test' });
      });

      it('should dispatch action with default actionName `PATCH_STATE`', () => {
        const store = storeFactory.createStore('myStore');

        mockStoreDispatch.calls.reset();
        store.patchState({ item: 'test' });

        expect(mockStoreDispatch).toHaveBeenCalledWith(
          getDispatchAction({
            storeName: 'myStore',
            actionName: 'PATCH_STATE',
            storeState: { ...getDefaultState(), item: 'test' },
          })
        );
      });

      it('should dispatch action with custom actionName', () => {
        const store = storeFactory.createStore('myStore');

        mockStoreDispatch.calls.reset();
        store.patchState({ item: 'test' }, 'myCustomAction');

        expect(mockStoreDispatch).toHaveBeenCalledWith(
          getDispatchAction({
            storeName: 'myStore',
            actionName: 'myCustomAction',
            storeState: { ...getDefaultState(), item: 'test' },
          })
        );
      });
    });

    describe('createEffect', () => {
      it('should change state while effect is running', () => {
        const store = storeFactory.createStore<string, number>('testStore');
        const testEffect = store.createEffect('testEffect', () =>
          cold('-a-#', { a: 'newValue' }, 500)
        );
        store.patchState({ item: 'oldValue' });

        mockStoreDispatch.calls.reset();

        testEffect();

        expect(store.state$).toBeObservable(
          cold('ab-c', {
            a: <StoreState<string, number>>{
              isLoading: true,
              item: 'oldValue',
            },
            b: <StoreState<string, number>>{
              isLoading: false,
              item: 'newValue',
            },
            c: <StoreState<string, number>>{
              isLoading: false,
              error: 500,
            },
          })
        );
        expect(mockStoreDispatch.calls.allArgs()).toEqual([
          [
            getEffectAction({
              storeName: 'testStore',
              effectName: 'testEffect',
              type: EffectStates.LOAD,
            })({
              payload: {
                isLoading: true,
                item: 'oldValue',
              },
            }),
          ],
          [
            getEffectAction({
              storeName: 'testStore',
              effectName: 'testEffect',
              type: EffectStates.SUCCESS,
            })({
              payload: {
                isLoading: false,
                item: 'newValue',
              },
            }),
          ],
          [
            getEffectAction({
              storeName: 'testStore',
              effectName: 'testEffect',
              type: EffectStates.ERROR,
            })({
              payload: {
                isLoading: false,
                error: 500,
              },
            }),
          ],
        ]);
      });
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
