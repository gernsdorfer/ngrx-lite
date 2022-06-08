import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { MyIncrementAction } from './shared-action.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class DemoEffect {
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MyIncrementAction),
        tap(({ payload }) =>
          this.snackbar.open(
            `counter increment: ${payload.counter}`,
            undefined,
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'snackbar',
              duration: 2000,
            }
          )
        )
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private snackbar: MatSnackBar) {}
}
