import { ComponentStore as NgrxComponentStore } from '@ngrx/component-store';
import { Inject, Injectable } from '@angular/core';
import { StateToken, StoreNameToken } from '../../injection-tokens/state.token';
import { Store as NgrxStore } from '@ngrx/store';
import { getCustomAction } from '../action-creator';
import {DevToolHelper} from "../dev-tool-helper.service";


@Injectable({ providedIn: 'root' })
export class ComponentStore<
  STATE extends object
> extends NgrxComponentStore<STATE> {
  constructor(
    protected ngrxStore: NgrxStore,
    protected devToolHelper: DevToolHelper,
    @Inject(StoreNameToken) protected storeName: string,
    @Inject(StateToken) state: STATE
  ) {
    super(state);
    if (!this.devToolHelper.isTimeTravelActive()) {
      this.dispatchCustomAction('init', state);
    }
  }

  get state(): STATE {
    return super.get();
  }

  override setState(
    stateOrUpdaterFn: ((state: STATE) => STATE) | STATE,
    action: string = 'SET_STATE',
    {
      skipLog,
      forced,
    }: {
      skipLog?: boolean;
      forced?: boolean;
    } = {}
  ) {
    if (this.devToolHelper.isTimeTravelActive() && !forced) {
      return;
    }
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
    if (this.devToolHelper.isTimeTravelActive()) {
      return;
    }

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
