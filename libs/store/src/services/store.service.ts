import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { StoreState } from '../models';
import {
  DefaultStateToken,
  StoreNameToken,
} from '../injection-tokens/default-state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getCustomAction, getEffectAction } from './action-creator';
import { EffectStates } from '../enums/effect-states.enum';

export const getDefaultState = <ITEM, ERROR>(): StoreState<ITEM, ERROR> => ({
  isLoading: false,
});

@Injectable({ providedIn: 'root' })
export class Store<ITEM, ERROR> extends ComponentStore<
  StoreState<ITEM, ERROR>
> {
  constructor(
    private ngrxStore: NgrxStore,
    @Inject(StoreNameToken) private storeName: string,
    @Inject(DefaultStateToken) state: StoreState<ITEM, ERROR>
  ) {
    super(state);
    this.dispatchCustomAction('init', state);
  }

  override setState(
    stateOrUpdaterFn:
      | ((state: StoreState<ITEM, ERROR>) => StoreState<ITEM, ERROR>)
      | StoreState<ITEM, ERROR>,
    action: string = 'SET_STATE',
    skipLog?: boolean
  ) {
    const newState =
      typeof stateOrUpdaterFn === 'function'
        ? stateOrUpdaterFn(this.get())
        : stateOrUpdaterFn;
    super.setState(newState);
    if (!skipLog) this.dispatchCustomAction(action, newState);
  }

  override patchState(
    partialStateOrUpdaterFn:
      | Partial<StoreState<ITEM, ERROR>>
      | ((state: StoreState<ITEM, ERROR>) => Partial<StoreState<ITEM, ERROR>>),
    action: string = 'PATCH_STATE'
  ) {
    const newState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;
    super.patchState(newState);
    this.dispatchCustomAction(action, { ...this.get(), ...newState });
  }

  get state(): StoreState<ITEM, ERROR> {
    return super.get();
  }

  createLoadingEffect = <EFFECT_PARAMS = void>(
    name: string,
    effect: (
      params: EFFECT_PARAMS
    ) => Observable<StoreState<ITEM, ERROR>['item']>
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        tap(() => {
          super.patchState({ isLoading: true });
          this.dispatchEffectAction(name, EffectStates.LOAD);
        }),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) => {
                super.setState({ isLoading: false, item });
                this.dispatchEffectAction(name, EffectStates.SUCCESS);
              },
              (error: ERROR) => {
                super.setState({ isLoading: false, error });
                this.dispatchEffectAction(name, EffectStates.ERROR);
              }
            )
          )
        )
      )
    );

  private dispatchCustomAction(action: string, state: StoreState<ITEM, ERROR>) {
    this.ngrxStore.dispatch(
      getCustomAction({ actionName: action, storeName: this.storeName })({
        payload: {
          ...getDefaultState(),
          item: undefined,
          error: undefined,
          ...state,
        },
      })
    );
  }

  private dispatchEffectAction(effectName: string, type: EffectStates) {
    this.ngrxStore.dispatch(
      getEffectAction({
        effectName,
        storeName: this.storeName,
        type: type,
      })({ payload: this.get() })
    );
  }
}
