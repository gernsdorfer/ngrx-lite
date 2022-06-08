import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
} from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { ofType } from '@ngrx/effects';
import { resetAction } from './reset.action';
import { tap } from 'rxjs';

export const MultipleCounterStoreName = new InjectionToken('MULTIPLE_COUNTER');

export interface MyState {
  counter: number;
}

@Injectable({ providedIn: 'any' })
export class MultipleCounterStore implements OnDestroy {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: this.storeName || 'MULTIPLE_COUNTER_STORE',
    defaultState: { counter: 0 },
  });

  public counterState$ = this.store.state$;

  constructor(
    private storeFactory: StoreFactory,
    @Optional()
    @Inject(MultipleCounterStoreName)
    private storeName?: string
  ) {}

  reset$ = this.store.createEffect((action) =>
    action.pipe(
      ofType(resetAction),
      tap(() => this.store.setState({ counter: 0 }, 'RESET'))
    )
  );

  increment() {
    this.store.patchState(
      ({ counter }) => ({ counter: counter + 1 }),
      'INCREMENT'
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
