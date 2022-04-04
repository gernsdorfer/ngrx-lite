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

  override setState(
    stateOrUpdaterFn:
      | ((state: StoreState<ITEM, ERROR>) => StoreState<ITEM, ERROR>)
      | StoreState<ITEM, ERROR>,
    action: string = 'UNKNOWN',
    skipLog?: boolean
  ) {
    super.setState(stateOrUpdaterFn);
    if (!skipLog) this.sendActionToStore(action);
  }

  override patchState(
    partialStateOrUpdaterFn:
      | Partial<StoreState<ITEM, ERROR>>
      | Observable<Partial<StoreState<ITEM, ERROR>>>
      | ((state: StoreState<ITEM, ERROR>) => Partial<StoreState<ITEM, ERROR>>),
    action: string = 'UNKNOWN'
  ) {
    super.patchState(partialStateOrUpdaterFn);
    this.sendActionToStore(action);
  }

  createEffect = <EFFECT_PARAMS>(
    name: string,
    effect: (
      params: EFFECT_PARAMS
    ) => Observable<StoreState<ITEM, ERROR>['item']>
  ) =>
    this.effect((params$: Observable<EFFECT_PARAMS>) =>
      params$.pipe(
        tap(() => {
          this.patchState({ isLoading: true }, 'LOAD');
        }),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) => this.setState({ isLoading: false, item }, 'SUCCESS'),
              (error: ERROR) =>
                this.setState({ isLoading: false, error }, 'ERROR')
            )
          )
        )
      )
    );

  private sendActionToStore(action: string) {
    this.ngrxStore.dispatch({
      type: `[${this.storeName}] ${action}`,
      payload: {
        ...getDefaultState,
        item: undefined,
        error: undefined,
        ...this.get(),
      },
    });
  }
}
