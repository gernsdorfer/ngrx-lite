import { tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { LoadingStoreState } from '../models';
import { StateToken, StoreNameToken } from '../injection-tokens/state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getEffectActionName } from './action-creator';
import { EffectStates } from '../enums/effect-states.enum';
import { ComponentStore, DevToolHelper } from './component-store.service';

export const getDefaultComponentLoadingState = <ITEM, ERROR>(
  state: Partial<LoadingStoreState<ITEM, ERROR>> = {}
): LoadingStoreState<ITEM, ERROR> => ({
  isLoading: false,
  error: undefined,
  item: undefined,
  ...state,
});

/** @deprecated use getDefaultLoadingState instead, this methode will be removed in the next major version */
export const getDefaultState = getDefaultComponentLoadingState;

@Injectable({ providedIn: 'root' })
export class ComponentLoadingStore<ITEM, ERROR> extends ComponentStore<
  LoadingStoreState<ITEM, ERROR>
> {
  constructor(
    ngrxStore: NgrxStore,
    devToolHelper: DevToolHelper,
    @Inject(StoreNameToken) storeName: string,
    @Inject(StateToken) state: LoadingStoreState<ITEM, ERROR>
  ) {
    super(ngrxStore, devToolHelper, storeName, state);
  }

  loadingEffect = <EFFECT_PARAMS = void>(
    name: string,
    effect: (
      params: EFFECT_PARAMS
    ) => Observable<LoadingStoreState<ITEM, ERROR>['item']>
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        tap(() =>
          super.patchState(
            () => ({ ...this.state, isLoading: true }),
            getEffectActionName(name, EffectStates.LOAD)
          )
        ),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) =>
                super.setState(
                  getDefaultComponentLoadingState({ item }),
                  getEffectActionName(name, EffectStates.SUCCESS)
                ),
              (error: ERROR) =>
                super.setState(
                  getDefaultComponentLoadingState({ error }),
                  getEffectActionName(name, EffectStates.ERROR)
                )
            )
          )
        )
      )
    );

  /** @deprecated use loadingEffect instead, this methode will be removed in the next major version */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  createLoadingEffect = this.loadingEffect;
}
