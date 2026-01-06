import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { createAction } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, asapScheduler, of } from 'rxjs';
import { SkipLogForStore, StateToken, StoreNameToken, } from '../../injection-tokens/state.token';
import { getCustomAction } from '../action-creator';
import { DevToolHelper } from '../dev-tool-helper.service';
import { ComponentStore } from './component-store.service';
import { vi } from "vitest";

interface MyState {
    myState: string;
    optionalValue?: string;
}

describe('ComponentStore', () => {
    const defaultStore: MyState = { myState: '' };
    const mockStore = {
        dispatch: vi.fn().mockName("MockStore.dispatch").mockReturnValue(undefined)
    };
    const devToolHelper = new DevToolHelper();
    const storeName = 'myStore';
    const actions = EMPTY;
    const getStore = (): ComponentStore<MyState> => TestBed.inject<ComponentStore<MyState>>(ComponentStore);
    beforeEach(() => {
        devToolHelper.setTimeTravelActive(false);
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

    const getDispatchAction = ({ actionName, storeState, }: {
        actionName: string;
        storeState: MyState;
    }) => getCustomAction({ storeName, actionName })({
        payload: storeState,
    });

    describe('create ComponentStore', () => {
        it('should send init action after create', () => {
            getStore();
            asapScheduler.flush();

            expect(mockStore.dispatch).toHaveBeenCalledWith(getDispatchAction({
                actionName: 'init',
                storeState: defaultStore,
            }));
        });

        it('should not send init action for SkipLogForStore', () => {
            TestBed.overrideProvider(SkipLogForStore, { useValue: true });
            mockStore.dispatch.mockClear();

            getStore();

            expect(mockStore.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('state', () => {
        it('should return state from store', () => {
            const { state } = getStore();
            expect(state()).toEqual(defaultStore);
        });
    });

    describe('createEffect', () => {
        it('should Effect', () => {
            const store = getStore();
            store.createEffect((action) => {
                expect(action).toEqual(actions);

                return action;
            });
        });

        it('should throw error for missing effects module', () => {
            TestBed.overrideProvider(Actions, { useValue: null });

            expect(() => getStore().createEffect(() => EMPTY)).toThrowError('@ngrx/effects is not imported. Please install `@ngrx/effects` and import `EffectsModule.forRoot([])` in your root module');
        });
    });

    describe('onActions', () => {
        it('should call callback', () => {
            const store = getStore();
            const customAction = createAction<string>(`TestAction`);

            vi.spyOn(store, 'createEffect').mockImplementation((effect) => {
                const effect$ = effect(of(customAction()));
                effect$.subscribe();
                return effect$;
            });

            const callback = vi.fn();
            store.onActions([customAction])(callback);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('setState', () => {
        beforeEach(() => {
            mockStore.dispatch.mockClear();
        });
        it('should set state to store with object', () => {
            getStore().setState({ myState: 'testValue' });

            expect(getStore().state()).toEqual({ myState: 'testValue' });
        });

        it('should set state to store with function', () => {
            getStore().setState((state) => ({ ...state, optionalValue: 'test' }));

            expect(getStore().state()).toEqual({
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

                expect(getStore().state()).toEqual({ ...defaultStore });
            });

            it('should not set state setState is forced', () => {
                getStore().setState((state) => ({ ...state, optionalValue: 'test' }), '', {
                    skipLog: true,
                    forced: true,
                });

                expect(getStore().state()).toEqual({
                    ...defaultStore,
                    optionalValue: 'test',
                });
            });
        });

        it('should dispatch action with default actionName `SET_STATE`', () => {
            mockStore.dispatch.mockClear();

            getStore().setState(defaultStore);
            asapScheduler.flush();

            expect(mockStore.dispatch).toHaveBeenCalledWith(getDispatchAction({
                actionName: 'SET_STATE',
                storeState: defaultStore,
            }));
        });

        it('should dispatch action with custom actionName', () => {
            mockStore.dispatch.mockClear();

            getStore().setState(defaultStore, 'myCustomAction');
            asapScheduler.flush();

            expect(mockStore.dispatch).toHaveBeenCalledWith(getDispatchAction({
                actionName: 'myCustomAction',
                storeState: defaultStore,
            }));
        });

        it('should not dispatch action for skipLog', () => {
            const store = getStore();
            mockStore.dispatch.mockClear();

            store.setState(defaultStore, 'myCustomAction', { skipLog: true });

            expect(mockStore.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('patchState', () => {
        beforeEach(() => {
            mockStore.dispatch.mockClear();
        });
        it('should set state to store with object', () => {
            getStore().patchState({ optionalValue: 'newValue' });

            expect(getStore().state()).toEqual({
                ...defaultStore,
                optionalValue: 'newValue',
            });
        });

        it('should set state to store with function', () => {
            getStore().patchState((state) => ({
                ...state,
                optionalValue: 'newValue',
            }));

            expect(getStore().state()).toEqual({
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

                expect(getStore().state()).toEqual({ ...defaultStore });
            });
        });

        it('should dispatch action with default actionName `PATCH_STATE`', () => {
            mockStore.dispatch.mockClear();
            getStore().patchState({ optionalValue: 'newValue' });
            asapScheduler.flush();

            expect(mockStore.dispatch).toHaveBeenCalledWith(getDispatchAction({
                actionName: 'PATCH_STATE',
                storeState: { ...defaultStore, optionalValue: 'newValue' },
            }));
        });

        it('should dispatch action with custom actionName', () => {
            mockStore.dispatch.mockClear();

            getStore().patchState({ optionalValue: 'newValue' }, 'myCustomAction');
            asapScheduler.flush();

            expect(mockStore.dispatch).toHaveBeenCalledWith(getDispatchAction({
                actionName: 'myCustomAction',
                storeState: { ...defaultStore, optionalValue: 'newValue' },
            }));
        });
    });
});
