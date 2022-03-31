import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { StoreState } from '../models';
import {
  DefaultStateToken,
  StoreNameToken,
} from '../injection-tokens/default-state.token';
import { Store as NgrxStore } from '@ngrx/store';

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
  }

  createEffect = <EFFECT_PARAMS>(
    name: string,
    effect: (
      params: EFFECT_PARAMS
    ) => Observable<StoreState<ITEM, ERROR>['item']>
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        tap(() =>
          this.patchState((state) =>
            this.setNewState('LOAD', { ...state, isLoading: true })
          )
        ),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) =>
                this.setState(
                  this.setNewState('SUCCESS', { isLoading: false, item })
                ),
              (error: ERROR) =>
                this.setState(
                  this.setNewState('ERROR', { isLoading: false, error })
                )
            )
          )
        )
      )
    );

  private setNewState<T>(action: string, state: T): T {
    this.ngrxStore.dispatch({
      type: `[${this.storeName}] ${action}`,
      payload: { ...state },
    });
    return state;
  }
}
