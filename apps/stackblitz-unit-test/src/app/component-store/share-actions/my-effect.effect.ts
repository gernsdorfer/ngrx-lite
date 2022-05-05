import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { MyIncrementAction } from './shared-action.component';

@Injectable()
export class DemoEffect {
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap(({payload}) => console.log('receive Data', payload))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
