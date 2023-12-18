import { Inject, inject, Injectable, OnDestroy } from '@angular/core';
import { ComponentStore as NgrxComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Action, Store as NgrxStore } from '@ngrx/store';
import { asapScheduler, Observable, Subject, takeUntil } from 'rxjs';
import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../../injection-tokens/state.token';
import { getCustomAction } from '../action-creator';
import { DevToolHelper } from '../dev-tool-helper.service';

@Injectable({ providedIn: 'root' })
export class ComponentStore<STATE extends object>
  extends NgrxComponentStore<STATE>
  implements OnDestroy
{
  protected actions = inject(Actions);
  protected ngrxStore = inject(NgrxStore);
  protected devToolHelper = inject(DevToolHelper);
  protected skipLogForStore = inject(SkipLogForStore);
  protected storeName = inject(StoreNameToken);

  constructor(@Inject(StateToken) state: STATE) {
    super(state);
    if (!this.devToolHelper.isTimeTravelActive()) {
      this.dispatchCustomAction('init', state);
    }
  }

  subject = new Subject<void>();

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subject.next();
    this.subject.complete();
  }

  createEffect<V = Action>(
    effect: (action: Actions) => Observable<V>,
  ): Observable<V> {
    if (!this.actions) {
      throw Error(
        '@ngrx/effects is not imported. Please install `@ngrx/effects` and import `EffectsModule.forRoot([])` in your root module',
      );
    }
    const effect$ = effect(this.actions).pipe(
      takeUntil(this.subject.asObservable()),
    );
    effect$.subscribe();
    return effect$;
  }

  override setState(
    stateOrUpdaterFn: ((state: STATE) => STATE) | STATE,
    action = 'SET_STATE',
    {
      skipLog,
      forced,
    }: {
      skipLog?: boolean;
      forced?: boolean;
    } = {},
  ) {
    if (this.devToolHelper.isTimeTravelActive() && !forced) {
      return;
    }
    const newState =
      typeof stateOrUpdaterFn === 'function'
        ? stateOrUpdaterFn(this.get())
        : stateOrUpdaterFn;

    super.setState(newState);
    if (!skipLog)
      asapScheduler.schedule(() => this.dispatchCustomAction(action, newState));
  }

  override patchState(
    partialStateOrUpdaterFn:
      | Partial<STATE>
      | ((state: STATE) => Partial<STATE>),
    action = 'PATCH_STATE',
  ) {
    if (this.devToolHelper.isTimeTravelActive()) {
      return;
    }
    const newState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;
    super.patchState(newState);
    asapScheduler.schedule(() =>
      this.dispatchCustomAction(action, { ...this.get(), ...newState }),
    );
  }

  protected dispatchCustomAction(action: string, state: STATE) {
    if (this.skipLogForStore) {
      return;
    }

    this.ngrxStore.dispatch(
      getCustomAction({ actionName: action, storeName: this.storeName })({
        payload: state,
      }),
    );
  }
}
