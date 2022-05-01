import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { MyIncrementAction } from './example.component';

@Injectable()
export class DemoEffect {
  constructor(private actions$: Actions) {}

  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap((data) => console.log('MyIncrementAction received',data))
      ),
    { dispatch: false }
  );
}
