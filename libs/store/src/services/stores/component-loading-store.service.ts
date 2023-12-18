import { Inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { Observable, filter, pairwise, startWith, switchMap } from 'rxjs';
import { EffectStates } from '../../enums/effect-states.enum';
import { StateToken } from '../../injection-tokens/state.token';
import { LoadingStoreState } from '../../models';
import { getEffectActionName } from '../action-creator';
import { ComponentStore } from './component-store.service';

export const getDefaultComponentLoadingState = <ITEM, ERROR>(
  state: Partial<LoadingStoreState<ITEM, ERROR>> = {},
): LoadingStoreState<ITEM, ERROR> => ({
  isLoading: false,
  error: undefined,
  item: undefined,
  ...state,
});

@Injectable({ providedIn: 'root' })
export class ComponentLoadingStore<ITEM, ERROR> extends ComponentStore<
  LoadingStoreState<ITEM, ERROR>
> {
  constructor(@Inject(StateToken) state: LoadingStoreState<ITEM, ERROR>) {
    super(state);
  }
  private hasPendingEffect = false;

  loadingEffect = <EFFECT_PARAMS = void>(
    name: string,
    effect: (
      params: EFFECT_PARAMS,
    ) => Observable<LoadingStoreState<ITEM, ERROR>['item']>,
    { canCache = false }: { canCache?: boolean } = {},
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        startWith(undefined as unknown as EFFECT_PARAMS),
        pairwise(),
        filter(([prev, next]) =>
          !canCache || !this.hasPendingEffect
            ? true
            : JSON.stringify(prev) !== JSON.stringify(next),
        ),
        switchMap(([, params]) =>
          this.runEffect<EFFECT_PARAMS>(name, params, effect),
        ),
      ),
    );

  private runEffect<EFFECT_PARAMS = void>(
    name: string,
    params: EFFECT_PARAMS,
    effect: (
      params: EFFECT_PARAMS,
    ) => Observable<LoadingStoreState<ITEM, ERROR>['item']>,
  ) {
    this.hasPendingEffect = true;
    super.patchState(
      (state) => ({ ...state, isLoading: true }),
      getEffectActionName(name, EffectStates.LOAD),
    );
    return effect(params).pipe(
      tapResponse(
        (item) =>
          super.setState(
            getDefaultComponentLoadingState({
              item,
            }),
            getEffectActionName(name, EffectStates.SUCCESS),
          ),
        (error: ERROR) =>
          super.setState(
            getDefaultComponentLoadingState({
              error,
            }),
            getEffectActionName(name, EffectStates.ERROR),
          ),
        () => (this.hasPendingEffect = false),
      ),
    );
  }
}
