import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { cold } from 'jasmine-marbles';
import { InjectionToken } from '@angular/core';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Action, ReducerManager } from '@ngrx/store';
import SpyObj = jasmine.SpyObj;

interface MyTestModel {
  name: string;
}

interface MyErrorState {
  message: string;
}

type MyState = StoreState<MyTestModel, MyErrorState>;

describe('StoreFactory', () => {
  const getStoreFactory = ({
    clientStorage,
  }: {
    clientStorage?: {
      provide: InjectionToken<ClientStoragePlugin>;
      useValue: ClientStoragePlugin;
    };
  } = {}): {
    storeFactory: StoreFactory;
    mockStore: MockStore;
    reducerManager: SpyObj<ReducerManager>;
  } => {
    const reducerManager = jasmine.createSpyObj<ReducerManager>(
      'ReducerManager',
      { addReducer: undefined, removeReducer: undefined },
      {
        currentReducers: {
          oldStore: () => undefined,
        },
      }
    );
    TestBed.configureTestingModule({
      providers: [
        StoreFactory,
        clientStorage,
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

    return {
      storeFactory: TestBed.inject(StoreFactory),
      mockStore: TestBed.inject(MockStore),
      reducerManager: reducerManager,
    };
  };
  it('should run without plugins', () => {
    const { storeFactory } = getStoreFactory({});

    const store = storeFactory.createStore<MyTestModel, MyErrorState>('testStore');
    const testEffect = store.createEffect('testEffect', () =>
      cold('-a-#', { a: <MyState['item']>{ name: 'test' } }, <MyState['error']>{
        message: 'testErrorMessage',
      })
    );

    store.setState({
      isLoading: false,
    });

    testEffect(undefined);

    expect(store.state$).toBeObservable(
      cold('ab-c', {
        a: <MyState>{ isLoading: true },
        b: <MyState>{ isLoading: false, item: <MyTestModel>{ name: 'test' } },
        c: <MyState>{
          isLoading: false,
          error: { message: 'testErrorMessage' },
        },
      })
    );
  });

  describe('ngrxStore', () => {
    it('should call removeReducer for destory the store', () => {
      const { storeFactory, reducerManager } = getStoreFactory();
      const myStore = storeFactory.createStore<MyTestModel, MyErrorState>(
        'myStory'
      );

      myStore.ngOnDestroy();

      expect(reducerManager.removeReducer).toHaveBeenCalledWith('myStory');
    });
    it('should warn for create same store', () => {
      const { storeFactory } = getStoreFactory();
      const spyWarn = spyOn(console, 'warn');
      storeFactory.createStore<MyTestModel, MyErrorState>('oldStore');
      expect(spyWarn).toHaveBeenCalledWith(
        'store oldStore exists, changes will be override. Please destroy your store or rename it before create a new one'
      );
    });
    it('should set state from ngrx store', () => {
      const { storeFactory, mockStore } = getStoreFactory();
      const store = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore'
      );

      mockStore.setState({
        testStore: <MyState>{ isLoading: false },
      });
      mockStore.setState({
        testStore: <MyState>{
          isLoading: false,
          item: <MyTestModel>{ name: 'test' },
        },
      });

      expect(store.state$).toBeObservable(
        cold('a', {
          a: <MyState>{ isLoading: false, item: <MyTestModel>{ name: 'test' } },
        })
      );
    });

    it('should patch with name', () => {
      const { storeFactory, mockStore } = getStoreFactory();
      const spyMockStoreDispatch = spyOn(mockStore, 'dispatch');
      const store = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore'
      );
      store.patchState(
        {
          isLoading: false,
          item: { name: 'XX' },
          error: { message: 'myErrorMessage' },
        },
        'CUSTOM_ACTION'
      );

      expect(store.state$).toBeObservable(
        cold('a', {
          a: <MyState>{
            isLoading: false,
            item: { name: 'XX' },
            error: { message: 'myErrorMessage' },
          },
        })
      );
      expect(spyMockStoreDispatch).toHaveBeenCalledWith({
        type: '[testStore] CUSTOM_ACTION',
        payload: {
          isLoading: false,
          item: { name: 'XX' },
          error: { message: 'myErrorMessage' },
        },
      } as Action);
    });

    it('should patchState without name', () => {
      const { storeFactory, mockStore } = getStoreFactory();
      const spyMockStoreDispatch = spyOn(mockStore, 'dispatch');
      const store = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore'
      );
      store.patchState({ isLoading: true });

      expect(store.state$).toBeObservable(
        cold('a', {
          a: <MyState>{ isLoading: true },
        })
      );
      expect(spyMockStoreDispatch).toHaveBeenCalledWith({
        type: '[testStore] UNKNOWN',
        payload: {
          isLoading: true,
          item: undefined,
          error: undefined,
        },
      } as Action);
    });

    describe('addStoreReducer', () => {
      it('should return undefined for unknown actiontype', (done) => {
        const { storeFactory, reducerManager } = getStoreFactory();
        reducerManager.addReducer.and.callFake((name, callback) => {
          expect(callback({}, { type: 'unknownType' })).toEqual({});

          expect(
            callback({}, { type: '[testStore]', payload: { isLoading: true } })
          ).toEqual({ isLoading: true });

          expect(
            callback(undefined, {
              type: '[testStore]',
              payload: { isLoading: true },
            })
          ).toEqual({ isLoading: true });

          done();
        });
        storeFactory.createStore<MyTestModel, MyErrorState>('testStore', {
          storage: 'sessionStoragePlugin',
        });
      });
    });
  });

  describe('ClientStorage Plugin', () => {
    it('should return state and store to session plugin ', () => {
      const sessionStore = jasmine.createSpyObj<ClientStoragePlugin>(
        'ClientStorage',
        {
          getDefaultState: <MyState>{
            isLoading: false,
            item: { name: 'stateFromStore' },
          },
          setStateToStorage: undefined,
        }
      );
      const { storeFactory } = getStoreFactory({
        clientStorage: {
          provide: SessionStoragePlugin,
          useValue: sessionStore,
        },
      });

      const store = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore',
        { storage: 'sessionStoragePlugin' }
      );

      expect(store.state$).toBeObservable(
        cold('a', {
          a: <MyState>{
            isLoading: false,
            item: <MyTestModel>{ name: 'stateFromStore' },
          },
        })
      );
      expect(sessionStore.setStateToStorage).toHaveBeenCalledWith('testStore', <
        MyState
      >{
        isLoading: false,
        item: { name: 'stateFromStore' },
      });
    });

    it('should return state and store to localstorage plugin ', () => {
      const localStore = jasmine.createSpyObj<ClientStoragePlugin>(
        'ClientStorage',
        {
          getDefaultState: <MyState>{
            isLoading: false,
            item: { name: 'stateFromStore' },
          },
          setStateToStorage: undefined,
        }
      );
      const { storeFactory } = getStoreFactory({
        clientStorage: {
          provide: LocalStoragePlugin,
          useValue: localStore,
        },
      });

      const store = storeFactory.createStore<MyTestModel, MyErrorState>(
        'testStore',
        { storage: 'localStoragePlugin' }
      );

      expect(store.state$).toBeObservable(
        cold('a', {
          a: <MyState>{
            isLoading: false,
            item: <MyTestModel>{ name: 'stateFromStore' },
          },
        })
      );
      expect(localStore.setStateToStorage).toHaveBeenCalledWith('testStore', <
        MyState
      >{
        isLoading: false,
        item: { name: 'stateFromStore' },
      });
    });
  });
});
