import { Inject, Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { tapResponse } from '@ngrx/operators';
import { ActionCreator } from '@ngrx/store';
import {
  Observable,
  filter,
  pairwise,
  repeat,
  startWith,
  switchMap,
} from 'rxjs';
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

const replacer = (
  key: string,
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) =>
  value instanceof Object && !(value instanceof Array)
    ? Object.keys(value)
        .sort()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((sorted: any, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {})
    : value;

const isEqual = <OBJECT = void>(obj1?: OBJECT, obj2?: OBJECT) =>
  JSON.stringify(obj1, replacer) === JSON.stringify(obj2, replacer);

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
    {
      canCache = false,
      skipSameActions = false,
      skipSamePendingActions = false,
      repeatActions = [],
    }: {
      /**
       * @deprecated Please use skipSamePendingActions instead
       */
      canCache?: boolean;
      skipSamePendingActions?: boolean;
      skipSameActions?: boolean;
      repeatActions?: ActionCreator[];
    } = {},
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        startWith({} as unknown as EFFECT_PARAMS),
        pairwise(),
        filter(([prev, next], index) =>
          (!this.getSkipSamePendingActions({
            canCache,
            skipSamePendingActions,
          }) ||
            !this.hasPendingEffect) &&
          !skipSameActions
            ? true
            : this.checkEffectPayload({ prev, next, index }),
        ),
        switchMap(([, params]) =>
          this.runEffect<EFFECT_PARAMS>(name, params, effect).pipe(
            repeat({
              delay: () =>
                this.createEffect((action) =>
                  action.pipe(ofType(...repeatActions)),
                ),
            }),
          ),
        ),
      ),
    );
  private getSkipSamePendingActions({
    canCache,
    skipSamePendingActions,
  }: {
    canCache: boolean;
    skipSamePendingActions: boolean;
  }) {
    return canCache || skipSamePendingActions;
  }

  private checkEffectPayload<EFFECT_PARAMS>({
    prev,
    next,
    index,
  }: {
    prev?: EFFECT_PARAMS;
    next?: EFFECT_PARAMS;
    index: number;
  }) {
    return index === 0 ? true : !isEqual(prev, next);
  }

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
          this.finishEffect({
            state: { item },
            effectName: name,
            type: EffectStates.SUCCESS,
          }),
        (error: ERROR) =>
          this.finishEffect({
            state: { error },
            effectName: name,
            type: EffectStates.ERROR,
          }),
      ),
    );
  }

  private finishEffect({
    state,
    effectName,
    type,
  }: {
    state: Partial<LoadingStoreState<ITEM, ERROR>>;
    effectName: string;
    type: EffectStates;
  }) {
    super.setState(
      getDefaultComponentLoadingState(state),
      getEffectActionName(effectName, type),
    );
    this.hasPendingEffect = false;
  }
}
