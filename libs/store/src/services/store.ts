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

  public reset = this.effect((action$: Observable<void>) =>
    action$.pipe(
      tap(() => {
        const newState = getDefaultState<ITEM, ERROR>();
        this.ngrxStore.dispatch({
          type: `[${this.storeName}] RESET`,
          payload: newState,
        });
        this.setState(newState);
      })
    )
  );

  createEffect = <EFFECT_PARAMS>(
    name: string,
    effect: (
      params: EFFECT_PARAMS
    ) => Observable<StoreState<ITEM, ERROR>['item']>
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        tap(() => {
          this.patchState((state) => {
            const newState = { isLoading: true };
            this.ngrxStore.dispatch({
              type: `[${this.storeName}] LOAD`,
              payload: { ...state, ...newState },
            });
            return { isLoading: true };
          });
        }),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) => {
                const newState = { isLoading: false, item };
                this.ngrxStore.dispatch({
                  type: `[${this.storeName}] SUCCESS`,
                  payload: newState,
                });
                this.setState(newState);
              },
              (error: ERROR) => {
                const newState = { isLoading: false, error };
                this.ngrxStore.dispatch({
                  type: `[${this.storeName}] SUCCESS`,
                  payload: newState,
                });
                this.setState(newState);
              }
            )
          )
        )
      )
    );
}
