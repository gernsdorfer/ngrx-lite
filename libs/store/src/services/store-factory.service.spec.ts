import { TestBed } from '@angular/core/testing';
import { ClientStoragePlugin } from '../models';
import { LocalStoragePlugin, SessionStoragePlugin } from '../injection-tokens';
import { StoreFactory } from './store-factory.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReducerManager } from '@ngrx/store';
import { getDefaultComponentLoadingState } from './component-loading-store.service';
import { getCustomAction } from '../services/action-creator';
import { Action, ActionReducer } from '@ngrx/store/src/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cold } from 'jasmine-marbles';
import { StoreDevtools } from '@ngrx/store-devtools';
import { defer, EMPTY } from 'rxjs';
import { LiftedState } from '@ngrx/store-devtools/src/reducer';

interface MyState {
  myState: string;
  optionalValue?: string;
}

const defaultMyState: MyState = { myState: '' };

describe('StoreFactory', () => {
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
  let storeFactory: StoreFactory;
  let mockStore: MockStore;

  describe('minimal Dependencies are available', () => {
    beforeEach(() => {
      liftedState$ = EMPTY;
      TestBed.configureTestingModule({
        providers: [
          StoreFactory,

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

    it('should create a componentStore without errors', () => {
      expect(() =>
        storeFactory.createComponentStore<MyState>({
          storeName: 'myStore',
          defaultState: defaultMyState,
        })
      ).not.toThrowError();
    });
  });
  describe('All Dependencies are available', () => {
    beforeEach(() => {
      liftedState$ = EMPTY;
      TestBed.configureTestingModule({
        providers: [
          StoreFactory,
          {
            provide: SessionStoragePlugin,
            useValue: sessionStoragePlugin,
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
      storeFactory = TestBed.inject(StoreFactory);
      mockStore = TestBed.inject(MockStore);
    });

    describe('createComponentStore', () => {
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

    describe('createFormComponentStore', () => {
      const myForm = new FormGroup(<{ [index in keyof MyState]: FormControl }>{
        myState: new FormControl('', [Validators.required]),
        optionalValue: new FormControl(''),
      });
      const defaultFormState = {
        ...defaultMyState,
        optionalValue: '',
      };
      beforeEach(() => {
        myForm.reset({ ...defaultMyState, optionalValue: '' });
      });

      describe('initialState', () => {
        beforeEach(() => {
          myForm.reset({ ...defaultFormState, optionalValue: '' });
          localStoragePlugin.getDefaultState.and.returnValue(<MyState>{
            ...defaultFormState,
            optionalValue: 'testDataFromLocalStorage',
          });
          sessionStoragePlugin.getDefaultState.and.returnValue(<MyState>{
            ...defaultFormState,
            optionalValue: 'testDataFromSessionStorage',
          });
        });

        it('should return default initial state', () => {
          const { state } = storeFactory.createFormComponentStore<MyState>({
            storeName: 'myStore',
            formGroup: myForm,
          });

          expect(state).toEqual(defaultFormState);
        });

        it('should return state from sessionStorage plugin', () => {
          const { state } = storeFactory.createFormComponentStore<MyState>({
            storeName: 'myStore',
            formGroup: myForm,
            plugins: {
              storage: 'sessionStoragePlugin',
            },
          });

          expect(state).toEqual({
            ...defaultFormState,
            optionalValue: 'testDataFromSessionStorage',
          });
        });

        it('should return state from localeStorage plugin', () => {
          const { state } = storeFactory.createFormComponentStore<MyState>({
            storeName: 'myStore',
            formGroup: myForm,
            plugins: {
              storage: 'localStoragePlugin',
            },
          });

          expect(state).toEqual({
            ...defaultFormState,
            optionalValue: 'testDataFromLocalStorage',
          });
        });
      });

      it('should set formChanges to state', () => {
        const { state$ } = storeFactory.createFormComponentStore<MyState>({
          storeName: 'myStore',
          formGroup: myForm,
        });

        myForm.patchValue({ myState: 'Test' });

        expect(state$).toBeObservable(
          cold('a', {
            a: {
              ...defaultFormState,
              myState: 'Test',
            },
          })
        );
      });

      it('should set stateChanges to store', () => {
        liftedState$ = cold('a', {
          a: <Partial<LiftedState>>{
            computedStates: [
              {
                state: {
                  myStore: <MyState>{
                    ...defaultFormState,
                    myState: 'newValue',
                  },
                },
              },
            ],
            currentStateIndex: 0,
            stagedActionIds: [0,1,2],
          },
        });
        const { state$ } = storeFactory.createFormComponentStore<MyState>({
          storeName: 'myStore',
          formGroup: myForm,
        });

        expect(state$).toBeObservable(
          cold('a', {
            a: {
              ...defaultFormState,
              myState: 'newValue',
            },
          })
        );
      });
    });

    describe('createStore', () => {
      describe('initialState', () => {
        beforeEach(() => {
          localStoragePlugin.getDefaultState.and.returnValue({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromSessionStore',
          });
          sessionStoragePlugin.getDefaultState.and.returnValue({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromLocalStore',
          });
        });

        it('should return default initial state', () => {
          const { state } = storeFactory.createStore<string, number>(
            'testStore'
          );

          expect(state).toEqual(getDefaultComponentLoadingState());
        });

        it('should return state from sessionStorage plugin', () => {
          const { state } = storeFactory.createStore<string, number>(
            'testStore',
            {
              storage: 'sessionStoragePlugin',
            }
          );

          expect(state).toEqual({
            ...getDefaultComponentLoadingState(),
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
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromSessionStore',
          });
        });
      });
    });

    describe('createComponentLoadingStore', () => {
      describe('initialState', () => {
        beforeEach(() => {
          localStoragePlugin.getDefaultState.and.returnValue({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromSessionStore',
          });
          sessionStoragePlugin.getDefaultState.and.returnValue({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromLocalStore',
          });
        });

        it('should return default initial state', () => {
          const { state } = storeFactory.createComponentLoadingStore<
            string,
            number
          >({ storeName: 'testStore' });

          expect(state).toEqual(getDefaultComponentLoadingState());
        });

        it('should return state from sessionStorage plugin', () => {
          const { state } = storeFactory.createComponentLoadingStore<
            string,
            number
          >({
            storeName: 'testStore',
            plugins: {
              storage: 'sessionStoragePlugin',
            },
          });

          expect(state).toEqual({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromLocalStore',
          });
        });

        it('should return state from localeStorage plugin', () => {
          const { state } = storeFactory.createComponentLoadingStore<
            string,
            number
          >({
            storeName: 'testStore',
            plugins: {
              storage: 'localStoragePlugin',
            },
          });

          expect(state).toEqual({
            ...getDefaultComponentLoadingState(),
            item: 'defaultValueFromSessionStore',
          });
        });
      });
    });

    describe('ngrxStore', () => {
      describe('add store to reducerManager', () => {
        it('should add addReducer for store', () => {
          reducerManager.addReducer.calls.reset();

          storeFactory.createComponentStore<MyState>({
            storeName: 'testStore',
            defaultState: defaultMyState,
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
          storeFactory.createComponentStore<MyState>({
            storeName: 'testStore',
            defaultState: defaultMyState,
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
            storeFactory.createComponentStore<MyState>({
              storeName: 'testStore',
              defaultState: defaultMyState,
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
            storeFactory.createComponentStore<MyState>({
              storeName: 'testStore',
              defaultState: defaultMyState,
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
          const { state$ } = storeFactory.createComponentStore<MyState>({
            storeName: 'myStore',
            defaultState: defaultMyState,
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
          const store = storeFactory.createComponentStore<MyState>({
            storeName: 'testStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'sessionStoragePlugin',
            },
          });

          sessionStoragePlugin.setStateToStorage.calls.reset();
          store.setState({ ...defaultMyState, myState: 'test' });

          expect(sessionStoragePlugin.setStateToStorage).toHaveBeenCalledWith(
            'testStore',
            { ...defaultMyState, myState: 'test' }
          );
        });

        it('should store changes to localStorage storage', () => {
          const store = storeFactory.createComponentStore<MyState>({
            storeName: 'testStore',
            defaultState: defaultMyState,
            plugins: {
              storage: 'localStoragePlugin',
            },
          });

          localStoragePlugin.setStateToStorage.calls.reset();

          store.setState({ ...defaultMyState, myState: 'test' });

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
      expect(() => TestBed.inject(StoreFactory)).toThrow(
        '@ngrx/store is not imported. Please install `@ngrx/store` and import `StoreModule.forRoot({})` in your root module'
      );
    });
  });
});

