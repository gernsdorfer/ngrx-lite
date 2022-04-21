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

export enum EffectStates {
  ERROR = 'ERROR',
  LOAD = 'LOAD',
  SUCCESS = 'SUCCESS',
}

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
    this.sendActionToStore('init', state);
  }

  get state(): StoreState<ITEM, ERROR> {
    return super.get();
  }

  override setState(
    stateOrUpdaterFn:
      | ((state: StoreState<ITEM, ERROR>) => StoreState<ITEM, ERROR>)
      | StoreState<ITEM, ERROR>,
    action: string = 'UNKNOWN',
    skipLog?: boolean
  ) {
    const newState =
      typeof stateOrUpdaterFn === 'function'
        ? stateOrUpdaterFn(this.get())
        : stateOrUpdaterFn;
    super.setState(newState);
    if (!skipLog) this.sendActionToStore(action, newState);
  }

  override patchState(
    partialStateOrUpdaterFn:
      | Partial<StoreState<ITEM, ERROR>>
      | ((state: StoreState<ITEM, ERROR>) => Partial<StoreState<ITEM, ERROR>>),
    action: string = 'UNKNOWN'
  ) {
    const newState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;
    super.patchState(newState);

    this.sendActionToStore(action, { ...this.get(), ...newState });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
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
          this.patchState({ isLoading: true }, `${name}:${EffectStates.LOAD}`);
        }),
        switchMap((params) =>
          effect(params).pipe(
            tapResponse(
              (item) =>
                this.setState({ isLoading: false, item }, `${name}:${EffectStates.SUCCESS}`),
              (error: ERROR) =>
                this.setState({ isLoading: false, error }, `${name}:${EffectStates.ERROR}`)
            )
          )
        )
      )
    );

  private sendActionToStore(action: string, state: StoreState<ITEM, ERROR>) {
    this.ngrxStore.dispatch({
      type: `[${this.storeName}] ${action}`,
      payload: {
        ...getDefaultState,
        item: undefined,
        error: undefined,
        ...state,
      },
    });
  }
}
