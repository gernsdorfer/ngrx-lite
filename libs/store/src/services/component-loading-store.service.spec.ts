import { TestBed } from '@angular/core/testing';
import { LoadingStoreState } from '../models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EffectStates } from '../enums';
import { getCustomAction, getEffectAction } from './action-creator';
import { cold } from 'jasmine-marbles';
import {
  ComponentLoadingStore,
  getDefaultComponentLoadingState,
} from './component-loading-store.service';
import {
  StateToken,
  StoreNameToken,
} from '../injection-tokens/state.token';

describe('LoadingStore', () => {
  let store: ComponentLoadingStore<string, number>;
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
          provide: StateToken,
          useValue: getDefaultComponentLoadingState(),
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
    store = TestBed.inject(ComponentLoadingStore);
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
        ...getDefaultComponentLoadingState,

        ...storeState,
      },
    });

  it('should send init action after create', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      getDispatchAction({
        actionName: 'init',
        storeState: getDefaultComponentLoadingState(),
      })
    );
  });

  describe('state', () => {
    it('should return state from store', () => {
      const { state } = store;
      expect(state).toEqual(getDefaultComponentLoadingState());
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
      store.patchState({ item: 'oldValue', error: 404 });

      mockStore.dispatch.calls.reset();

      testEffect();

      expect(store.state$).toBeObservable(
        cold('ab-c', {
          a: getDefaultComponentLoadingState({
            isLoading: true,
            item: 'oldValue',
            error: 404,
          }),
          b: getDefaultComponentLoadingState({
            item: 'newValue',
          }),
          c: getDefaultComponentLoadingState({ error: 500 }),
        })
      );

      expect(mockStore.dispatch.calls.allArgs()).toEqual([
        [
          getEffectAction({
            storeName,
            effectName: 'testEffect',
            type: EffectStates.LOAD,
          })({
            payload: getDefaultComponentLoadingState({
              isLoading: true,
              item: 'oldValue',
              error: 404,
            }),
          }),
        ],
        [
          getEffectAction({
            storeName,
            effectName: 'testEffect',
            type: EffectStates.SUCCESS,
          })({
            payload: getDefaultComponentLoadingState({
              item: 'newValue',
            }),
          }),
        ],
        [
          getEffectAction({
            storeName,
            effectName: 'testEffect',
            type: EffectStates.ERROR,
          })({
            payload: getDefaultComponentLoadingState({
              error: 500,
            }),
          }),
        ],
      ]);
    });
  });
});
