import { tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { LoadingStoreState } from '../../models';
import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../../injection-tokens/state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getEffectActionName } from '../action-creator';
import { EffectStates } from '../../enums/effect-states.enum';
import { ComponentStore } from './component-store.service';
import { DevToolHelper } from '../dev-tool-helper.service';
import { Actions } from '@ngrx/effects';

export const getDefaultComponentLoadingState = <ITEM, ERROR>(
  state: Partial<LoadingStoreState<ITEM, ERROR>> = {}
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
  constructor(
    actions: Actions,
    ngrxStore: NgrxStore,
    devToolHelper: DevToolHelper,
    @Inject(StoreNameToken) storeName: string,
    @Inject(StateToken) state: LoadingStoreState<ITEM, ERROR>,
    @Inject(SkipLogForStore) skipLogForStore: boolean
  ) {
    super(actions, ngrxStore, devToolHelper, skipLogForStore, storeName, state);
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
}
