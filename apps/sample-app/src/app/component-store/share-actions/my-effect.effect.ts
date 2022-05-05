import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { MyIncrementAction } from './example.component';

@Injectable()
export class DemoEffect {
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap((data) => console.log('DemoEffect receive Data', data))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
