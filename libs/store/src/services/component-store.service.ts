import { ComponentStore as NgrxComponentStore } from '@ngrx/component-store';
import { Inject, Injectable } from '@angular/core';
import {
  DefaultLoadingStateToken,
  StoreNameToken,
} from '../injection-tokens/default-loading-state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getCustomAction } from './action-creator';

@Injectable({ providedIn: 'root' })
export class ComponentStore<
  STATE extends object
> extends NgrxComponentStore<STATE> {
  constructor(
    protected ngrxStore: NgrxStore,
    @Inject(StoreNameToken) protected storeName: string,
    @Inject(DefaultLoadingStateToken) state: STATE
  ) {
    super(state);
    this.dispatchCustomAction('init', state);
  }

  get state(): STATE {
    return super.get();
  }

  override setState(
    stateOrUpdaterFn: ((state: STATE) => STATE) | STATE,
    action: string = 'SET_STATE',
    skipLog?: boolean
  ) {
    const newState =
      typeof stateOrUpdaterFn === 'function'
        ? (stateOrUpdaterFn as unknown as any)(this.get())
        : stateOrUpdaterFn;
    super.setState(newState);
    if (!skipLog) this.dispatchCustomAction(action, newState);
  }

  override patchState(
    partialStateOrUpdaterFn:
      | Partial<STATE>
      | ((state: STATE) => Partial<STATE>),
    action: string = 'PATCH_STATE'
  ) {
    const newState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;
    super.patchState(newState);
    this.dispatchCustomAction(action, { ...this.get(), ...newState });
  }

  protected dispatchCustomAction(action: string, state: STATE) {
    this.ngrxStore.dispatch(
      getCustomAction({ actionName: action, storeName: this.storeName })({
        payload: state,
      })
    );
  }
}
