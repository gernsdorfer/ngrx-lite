import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getCustomAction } from './action-creator';
import { ComponentStore, DevToolHelper } from './component-store.service';
import { StateToken, StoreNameToken } from '../injection-tokens/state.token';

interface MyState {
  myState: string;
  optionalValue?: string;
}

describe('ComponentStore', () => {
  let store: ComponentStore<MyState>;
  const defaultStore: MyState = { myState: '' };
  const mockStore = jasmine.createSpyObj<MockStore>('MockStore', {
    dispatch: undefined,
  });
  const devToolHelper = new DevToolHelper();
  const storeName = 'myStore';

  beforeEach(() => {
    devToolHelper.setCanChangeState(true);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StoreNameToken,
          useValue: storeName,
        },
        {
          provide: DevToolHelper,
          useValue: devToolHelper,
        },
        {
          provide: StateToken,
          useValue: <MyState>{ myState: '' },
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
    store = TestBed.inject<ComponentStore<MyState>>(ComponentStore);
  });

  const getDispatchAction = ({
    actionName,
    storeState,
  }: {
    actionName: string;
    storeState: MyState;
  }) =>
    getCustomAction({ storeName, actionName })({
      payload: storeState,
    });

  it('should send init action after create', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      getDispatchAction({
        actionName: 'init',
        storeState: defaultStore,
      })
    );
  });

  describe('state', () => {
    it('should return state from store', () => {
      const { state } = store;
      expect(state).toEqual(defaultStore);
    });
  });

  describe('setState', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should set state to store with object', () => {
      store.setState({ myState: 'testValue' });

      expect(store.state).toEqual({ myState: 'testValue' });
    });

    it('should set state to store with function', () => {
      store.setState((state) => ({ ...state, optionalValue: 'test' }));

      expect(store.state).toEqual({ ...defaultStore, optionalValue: 'test' });
    });

    describe('can not change state', () => {
      beforeEach(() => {
        devToolHelper.setCanChangeState(false)
      });
      it('should not set state if can not changed', () => {
        store.setState((state) => ({ ...state, optionalValue: 'test' }));

        expect(store.state).toEqual({ ...defaultStore });
      });

      it('should not set state setState is forced', () => {
        store.setState((state) => ({ ...state, optionalValue: 'test' }), '', {
          skipLog: true,
          forced: true,
        });

        expect(store.state).toEqual({ ...defaultStore, optionalValue: 'test' });
      });
    });

    it('should dispatch action with default actionName `SET_STATE`', () => {
      mockStore.dispatch.calls.reset();

      store.setState(defaultStore);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'SET_STATE',
          storeState: defaultStore,
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      store.setState(defaultStore, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: defaultStore,
        })
      );
    });

    it('should not dispatch action for skipLog', () => {
      mockStore.dispatch.calls.reset();
      store.setState(defaultStore, 'myCustomAction', { skipLog: true });

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('patchState', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should set state to store with object', () => {
      store.patchState({ optionalValue: 'newValue' });

      expect(store.state).toEqual({
        ...defaultStore,
        optionalValue: 'newValue',
      });
    });

    it('should set state to store with function', () => {
      store.patchState((state) => ({
        ...state,
        optionalValue: 'newValue',
      }));

      expect(store.state).toEqual({
        ...defaultStore,
        optionalValue: 'newValue',
      });
    });

    describe('can not change state', () => {
      beforeEach(() => {
        devToolHelper.setCanChangeState(false);
      });
      it('should not set state if can not changed', () => {
        store.patchState((state) => ({ ...state, optionalValue: 'test' }));

        expect(store.state).toEqual({ ...defaultStore });
      });
    });

    it('should dispatch action with default actionName `PATCH_STATE`', () => {
      mockStore.dispatch.calls.reset();
      store.patchState({ optionalValue: 'newValue' });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'PATCH_STATE',
          storeState: { ...defaultStore, optionalValue: 'newValue' },
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      store.patchState({ optionalValue: 'newValue' }, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: { ...defaultStore, optionalValue: 'newValue' },
        })
      );
    });
  });
});
