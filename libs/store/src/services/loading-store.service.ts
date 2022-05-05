import { tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { LoadingStoreState } from '../models';
import {
  DefaultLoadingStateToken,
  StoreNameToken,
} from '../injection-tokens/default-loading-state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getEffectActionName } from './action-creator';
import { EffectStates } from '../enums/effect-states.enum';
import { Store } from './store.service';

export const getDefaultState = <ITEM, ERROR>(): LoadingStoreState<
  ITEM,
  ERROR
> => ({
  isLoading: false,
});

@Injectable({ providedIn: 'root' })
export class LoadingStore<ITEM, ERROR> extends Store<
  LoadingStoreState<ITEM, ERROR>
> {
  constructor(
    ngrxStore: NgrxStore,
    @Inject(StoreNameToken) storeName: string,
    @Inject(DefaultLoadingStateToken) state: LoadingStoreState<ITEM, ERROR>
  ) {
    super(ngrxStore, storeName, state);
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
                  { isLoading: false, item, error: undefined },
                  getEffectActionName(name, EffectStates.SUCCESS)
                ),
              (error: ERROR) =>
                super.setState(
                  { isLoading: false, error, item: undefined },
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
