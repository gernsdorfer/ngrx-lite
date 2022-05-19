import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getCustomAction } from '../action-creator';
import { ComponentStore } from './component-store.service';
import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../../injection-tokens/state.token';
import { DevToolHelper } from '../dev-tool-helper.service';

interface MyState {
  myState: string;
  optionalValue?: string;
}

describe('ComponentStore', () => {
  const defaultStore: MyState = { myState: '' };
  const mockStore = jasmine.createSpyObj<MockStore>('MockStore', {
    dispatch: undefined,
  });
  const devToolHelper = new DevToolHelper();
  const storeName = 'myStore';
  const getStore = (): ComponentStore<MyState> =>
    TestBed.inject<ComponentStore<MyState>>(ComponentStore);

  beforeEach(() => {
    devToolHelper.setTimeTravelActive(false);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StoreNameToken,
          useValue: storeName,
        },
        {
          provide: SkipLogForStore,
          useValue: false,
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

  describe('create ComponentStore', () => {
    it('should send init action after create', () => {
      getStore();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'init',
          storeState: defaultStore,
        })
      );
    });

    it('should not send init action for SkipLogForStore', () => {
      TestBed.overrideProvider(SkipLogForStore, { useValue: true });
      mockStore.dispatch.calls.reset();

      getStore();

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('state', () => {
    it('should return state from store', () => {
      const { state } = getStore();
      expect(state).toEqual(defaultStore);
    });
  });

  describe('setState', () => {
    beforeEach(() => {
      mockStore.dispatch.calls.reset();
    });
    it('should set state to store with object', () => {
      getStore().setState({ myState: 'testValue' });

      expect(getStore().state).toEqual({ myState: 'testValue' });
    });

    it('should set state to store with function', () => {
      getStore().setState((state) => ({ ...state, optionalValue: 'test' }));

      expect(getStore().state).toEqual({
        ...defaultStore,
        optionalValue: 'test',
      });
    });

    describe('can not change state', () => {
      beforeEach(() => {
        devToolHelper.setTimeTravelActive(true);
      });
      it('should not set state if can not changed', () => {
        getStore().setState((state) => ({ ...state, optionalValue: 'test' }));

        expect(getStore().state).toEqual({ ...defaultStore });
      });

      it('should not set state setState is forced', () => {
        getStore().setState(
          (state) => ({ ...state, optionalValue: 'test' }),
          '',
          {
            skipLog: true,
            forced: true,
          }
        );

        expect(getStore().state).toEqual({
          ...defaultStore,
          optionalValue: 'test',
        });
      });
    });

    it('should dispatch action with default actionName `SET_STATE`', () => {
      mockStore.dispatch.calls.reset();

      getStore().setState(defaultStore);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'SET_STATE',
          storeState: defaultStore,
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      getStore().setState(defaultStore, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: defaultStore,
        })
      );
    });

    it('should not dispatch action for skipLog', () => {
      const store = getStore();
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
      getStore().patchState({ optionalValue: 'newValue' });

      expect(getStore().state).toEqual({
        ...defaultStore,
        optionalValue: 'newValue',
      });
    });

    it('should set state to store with function', () => {
      getStore().patchState((state) => ({
        ...state,
        optionalValue: 'newValue',
      }));

      expect(getStore().state).toEqual({
        ...defaultStore,
        optionalValue: 'newValue',
      });
    });

    describe('can not change state', () => {
      beforeEach(() => {
        devToolHelper.setTimeTravelActive(true);
      });
      it('should not set state if can not changed', () => {
        getStore().patchState((state) => ({ ...state, optionalValue: 'test' }));

        expect(getStore().state).toEqual({ ...defaultStore });
      });
    });

    it('should dispatch action with default actionName `PATCH_STATE`', () => {
      mockStore.dispatch.calls.reset();
      getStore().patchState({ optionalValue: 'newValue' });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'PATCH_STATE',
          storeState: { ...defaultStore, optionalValue: 'newValue' },
        })
      );
    });

    it('should dispatch action with custom actionName', () => {
      mockStore.dispatch.calls.reset();

      getStore().patchState({ optionalValue: 'newValue' }, 'myCustomAction');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getDispatchAction({
          actionName: 'myCustomAction',
          storeState: { ...defaultStore, optionalValue: 'newValue' },
        })
      );
    });
  });
});
