import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Action, createAction } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { EMPTY, Subject, of, tap } from 'rxjs';
import { vi } from 'vitest';
import { EffectStates } from '../../enums';
import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../../injection-tokens/state.token';
import { LoadingStoreState } from '../../models';
import { getCustomAction, getEffectAction } from '../action-creator';
import { DevToolHelper } from '../dev-tool-helper.service';
import {
  ComponentLoadingStore,
  getDefaultComponentLoadingState,
} from './component-loading-store.service';

describe('LoadingStore', () => {
  let store: ComponentLoadingStore<string, number>;
  const mockStore = {
    dispatch: vi.fn().mockName('MockStore.dispatch').mockReturnValue(undefined),
  };
  const storeName = 'myStore';
  const devToolHelper = new DevToolHelper();
  const actions = {
    lift: vi.fn().mockName('Actions.lift').mockReturnValue(EMPTY),
  };
  const action$ = new Subject<Action>();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useValue: actions,
        },
        {
          provide: StoreNameToken,
          useValue: storeName,
        },
        {
          provide: StateToken,
          useValue: getDefaultComponentLoadingState(),
        },
        {
          provide: SkipLogForStore,
          useValue: false,
        },
        {
          provide: DevToolHelper,
          useValue: devToolHelper,
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
    vi.spyOn(store, 'createEffect').mockImplementation((effect) =>
      effect(action$),
    );
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

  it('should send init action after create', async () => {
    await vi.waitFor(() => {
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      getDispatchAction({
        actionName: 'init',
        storeState: getDefaultComponentLoadingState(),
      }),
    );
  });

  describe('state', () => {
    it('should return state from store', () => {
      const { state } = store;
      expect(state()).toEqual(getDefaultComponentLoadingState());
    });
  });

  describe('loadingEffect', () => {
    beforeEach(() => {
      mockStore.dispatch.mockClear();
    });
    it('should change state while effect is running', async () => {
      vi.useFakeTimers();
      const testEffect = store.loadingEffect('testEffect', () =>
        cold('-a-#', { a: 'newValue' }, 500),
      );
      store.patchState({ item: 'oldValue', error: 404 });
      await vi.waitFor(() => {
        expect(mockStore.dispatch).toHaveBeenCalled();
      });
      mockStore.dispatch.mockClear();

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
        }),
      );

      await vi.waitFor(
        () => {
          expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
        },
        { timeout: 5000 },
      );

      expect(vi.mocked(mockStore.dispatch).mock.calls).toEqual([
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
      vi.useRealTimers();
    });

    it('should change state while effect is running in cache mode (with option: canCache)', async () => {
      vi.useFakeTimers();
      const testEffect = store.loadingEffect(
        'testEffect',
        () => cold('-a-|', { a: 'newValue' }),
        { canCache: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      await vi.waitFor(() => {
        expect(mockStore.dispatch).toHaveBeenCalled();
      });
      mockStore.dispatch.mockClear();

      testEffect();
      testEffect();

      expect(store.state$).toBeObservable(
        cold('ab', {
          a: getDefaultComponentLoadingState({
            isLoading: true,
            item: 'oldValue',
            error: 404,
          }),
          b: getDefaultComponentLoadingState({
            item: 'newValue',
          }),
        }),
      );

      await vi.waitFor(
        () => {
          expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
        },
        { timeout: 5000 },
      );

      expect(vi.mocked(mockStore.dispatch).mock.calls).toEqual([
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
      ]);
      vi.useRealTimers();
    });

    it('should change state while effect is running in cache mode (with option: skipSamePendingActions)', async () => {
      vi.useFakeTimers();
      const testEffect = store.loadingEffect(
        'testEffect',
        () => cold('-a-|', { a: 'newValue' }),
        { skipSamePendingActions: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      await vi.waitFor(() => {
        expect(mockStore.dispatch).toHaveBeenCalled();
      });
      mockStore.dispatch.mockClear();

      testEffect();
      testEffect();

      expect(store.state$).toBeObservable(
        cold('ab', {
          a: getDefaultComponentLoadingState({
            isLoading: true,
            item: 'oldValue',
            error: 404,
          }),
          b: getDefaultComponentLoadingState({
            item: 'newValue',
          }),
        }),
      );

      await vi.waitFor(
        () => {
          expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
        },
        { timeout: 5000 },
      );

      expect(vi.mocked(mockStore.dispatch).mock.calls).toEqual([
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
      ]);
    });

    it('should skip skip same actions for option skipSameActions', () => {
      const spyEffectRun = vi.fn().mockReturnValue(of('newValue'));
      const testEffect = store.loadingEffect(
        'testEffect',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_payload: {
          key1: string;
          key2: {
            child: {
              a: string;
              b: string;
            };
          };
        }) => spyEffectRun(),
        { skipSameActions: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      mockStore.dispatch.mockClear();

      testEffect({ key1: 'value1', key2: { child: { b: '1', a: '1' } } });
      testEffect({ key2: { child: { a: '1', b: '1' } }, key1: 'value1' });

      expect(store.state()).toEqual(
        getDefaultComponentLoadingState({
          item: 'newValue',
        }),
      );
      expect(vi.mocked(spyEffectRun).mock.calls.length).toEqual(1);
    });

    it('should not skip different actions (with deep Objects) for option skipSameActions', () => {
      const spyEffectRun = vi.fn().mockReturnValue(of('newValue'));
      const testEffect = store.loadingEffect(
        'testEffect',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_payload: {
          key1: string;
          key2: {
            child: {
              a: string;
              b: string;
            };
          };
        }) => spyEffectRun(),
        { skipSameActions: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      mockStore.dispatch.mockClear();

      testEffect({ key1: 'value1', key2: { child: { b: '1', a: '2' } } });
      testEffect({ key2: { child: { a: '2', b: '2' } }, key1: 'value1' });

      expect(store.state()).toEqual(
        getDefaultComponentLoadingState({
          item: 'newValue',
        }),
      );
      expect(vi.mocked(spyEffectRun).mock.calls.length).toEqual(2);
    });

    it('should skip skip same actions for option skipSameActions, without payload', () => {
      const spyEffectRun = vi.fn().mockReturnValue(of('newValue'));
      const testEffect = store.loadingEffect(
        'testEffect',
        () => spyEffectRun(),
        { skipSameActions: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      mockStore.dispatch.mockClear();

      testEffect();
      testEffect();

      expect(store.state()).toEqual(
        getDefaultComponentLoadingState({
          item: 'newValue',
        }),
      );
      expect(vi.mocked(spyEffectRun).mock.calls.length).toEqual(1);
    });

    it('should skip skip same actions for option skipSameActions, without payload', () => {
      const spyEffectRun = vi.fn().mockReturnValue(of('newValue'));
      const testEffect = store.loadingEffect(
        'testEffect',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (data: { demo?: string }) => spyEffectRun(),
        { skipSameActions: true },
      );
      store.patchState({ item: 'oldValue', error: 404 });
      mockStore.dispatch.mockClear();

      testEffect({});
      testEffect({});

      expect(store.state()).toEqual(
        getDefaultComponentLoadingState({
          item: 'newValue',
        }),
      );
      expect(vi.mocked(spyEffectRun).mock.calls.length).toEqual(1);
    });

    it('should replay effect', () => {
      const spyEffectRun = vi.fn();

      const customAction = createAction<string>(`TestAction`);

      const testEffect = store.loadingEffect(
        'testEffect',
        () => of('newValue').pipe(tap(() => spyEffectRun())),
        { repeatActions: [customAction] },
      );

      testEffect();
      action$.next(customAction);

      expect(store.state()).toEqual(
        getDefaultComponentLoadingState({
          item: 'newValue',
        }),
      );
      expect(vi.mocked(spyEffectRun).mock.calls.length).toEqual(2);
    });
  });
});
