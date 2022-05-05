import { TestBed } from '@angular/core/testing';
import { LoadingStoreState } from '../models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EffectStates } from '../enums';
import { getCustomAction, getEffectAction } from './action-creator';
import { cold } from 'jasmine-marbles';
import { getDefaultState, LoadingStore } from './loading-store.service';
import {
  DefaultStateToken,
  StoreNameToken,
} from '../injection-tokens/default-state.token';

describe('LoadingStore', () => {
  let store: LoadingStore<string, number>;
  const mockStore = jasmine.createSpyObj<MockStore>('MockStore', {
    dispatch: undefined,
  });
  const storeName = 'myStore';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StoreNameToken,
          useValue: storeName,
        },
        {
          provide: DefaultStateToken,
          useValue: getDefaultState(),
        },
        provideMockStore({
          initialState: {},
        }),
        {
          provide: MockStore,
          useValue: mockStore,
        },
      ],
      teardown: { destroyAfterEach: false },
    });
    store = TestBed.inject(LoadingStore);
  });

  const getDispatchAction = <ITEM, ERROR>({
    actionName,
    storeState,
  }: {
    actionName: string;
    storeState: LoadingStoreState<ITEM, ERROR>;
  }) =>
    getCustomAction({ storeName, actionName })({
      payload: {
        ...getDefaultState,

        ...storeState,
      },
    });

  it('should send init action after create', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      getDispatchAction({
        actionName: 'init',
        storeState: getDefaultState(),
      })
    );
  });

  describe('state', () => {
    it('should return state from store', () => {
      const { state } = store;
      expect(state).toEqual(getDefaultState());
    });
  });

  describe('setState', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should set state to store with object', () => {
      store.setState({ isLoading: true, item: 'test' });

      expect(store.state).toEqual({ isLoading: true, item: 'test' });
    });

    it('should set state to store with function', () => {
      store.setState((state) => ({ ...state, item: 'test' }));

      expect(store.state).toEqual({ isLoading: false, item: 'test' });
    });

    it('should dispatch action with default actionName `SET_STATE`', () => {
      mockStore.dispatch.calls.reset();

      store.setState({ isLoading: true, item: 'test' });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'SET_STATE',
          storeState: { isLoading: true, item: 'test' },
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      store.setState({ isLoading: true, item: 'test' }, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: { isLoading: true, item: 'test' },
        })
      );
    });

    it('should not dispatch action for skipLog', () => {
      mockStore.dispatch.calls.reset();
      store.setState({ isLoading: true, item: 'test' }, 'myCustomAction', true);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('patchState', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should set state to store with object', () => {
      store.patchState({ item: 'test' });

      expect(store.state).toEqual({ isLoading: false, item: 'test' });
    });

    it('should set state to store with function', () => {
      store.patchState((state) => ({ ...state, item: 'test' }));

      expect(store.state).toEqual({ isLoading: false, item: 'test' });
    });

    it('should dispatch action with default actionName `PATCH_STATE`', () => {
      mockStore.dispatch.calls.reset();
      store.patchState({ item: 'test' });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'PATCH_STATE',
          storeState: { ...getDefaultState(), item: 'test' },
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      store.patchState({ item: 'test' }, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: { ...getDefaultState(), item: 'test' },
        })
      );
    });
  });

  describe('loadingEffect', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should change state while effect is running', () => {
      const testEffect = store.loadingEffect('testEffect', () =>
        cold('-a-#', { a: 'newValue' }, 500)
      );
      store.patchState({ item: 'oldValue' });

      mockStore.dispatch.calls.reset();

      testEffect();

      expect(store.state$).toBeObservable(
        cold('ab-c', {
          a: <LoadingStoreState<string, number>>{
            isLoading: true,
            item: 'oldValue',
          },
          b: <LoadingStoreState<string, number>>{
            isLoading: false,
            item: 'newValue',
            error: undefined,
          },
          c: <LoadingStoreState<string, number>>{
            isLoading: false,
            error: 500,
            item: undefined,
          },
        })
      );
      console.log(mockStore.dispatch.calls.allArgs().length);
      expect(mockStore.dispatch.calls.allArgs()).toEqual([
        [
          getEffectAction({
            storeName,
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
            storeName,
            effectName: 'testEffect',
            type: EffectStates.SUCCESS,
          })({
            payload: {
              isLoading: false,
              item: 'newValue',
              error: undefined,
            },
          }),
        ],
        [
          getEffectAction({
            storeName,
            effectName: 'testEffect',
            type: EffectStates.ERROR,
          })({
            payload: {
              isLoading: false,
              error: 500,
              item: undefined,
            },
          }),
        ],
      ]);
    });
  });
});
