import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin, StoreState } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { cold } from 'jasmine-marbles';
import { InjectionToken } from '@angular/core';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';

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
    ngrxStore: MockStore;
    reducerManager: ReducerManager;
  } => {
    TestBed.configureTestingModule({
      providers: [
        StoreFactory,
        clientStorage,
        provideMockStore({
          initialState: { counter: 0 },
        }),
      ].filter((provider) => provider),
      teardown: { destroyAfterEach: false },
    });

    return {
      storeFactory: TestBed.inject(StoreFactory),
      ngrxStore: TestBed.inject(MockStore),
      reducerManager: TestBed.inject(ReducerManager),
    };
  };

  describe('reset', () => {
    it('should reset state to default state', () => {
      const { storeFactory } = getStoreFactory();

      const store = storeFactory.getStore<MyTestModel, MyErrorState>(
        'testStore'
      );

      store.setState({ isLoading: true, item: { name: 'testName' } });

      store.reset();

      expect(store.state$).toBeObservable(
        cold('a', { a: { isLoading: false } })
      );
    });
  });

  it('should run without plugins', () => {
    const { storeFactory } = getStoreFactory({});

    const store = storeFactory.getStore<MyTestModel, MyErrorState>('testStore');
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
    it('should set state from ngrx store', () => {
      const { storeFactory, ngrxStore } = getStoreFactory();
      const store = storeFactory.getStore<MyTestModel, MyErrorState>(
        'testStore',
        { storage: 'sessionStoragePlugin' }
      );
      ngrxStore.setState({
        testStore: <MyState>{ isLoading: false },
      });
      ngrxStore.setState({
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
    describe('add reducer', () => {
      it('should return undefined for unknown actiontype', (done) => {
        const { storeFactory, reducerManager } = getStoreFactory();
        spyOn(reducerManager, 'addReducer').and.callFake((name, callback) => {
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
        storeFactory.getStore<MyTestModel, MyErrorState>('testStore', {
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

      const store = storeFactory.getStore<MyTestModel, MyErrorState>(
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

      const store = storeFactory.getStore<MyTestModel, MyErrorState>(
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
