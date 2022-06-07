import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { MyIncrementAction } from './shared-action.component';
import { DemoEffect } from './my-effect.effect';
import { MatSnackBar } from '@angular/material/snack-bar';
import createSpyObj = jasmine.createSpyObj;

describe('DemoEffectX', () => {
  let actions$ = new Observable<Action>();

  const matSnackBar = createSpyObj<MatSnackBar>('MatSnackBar', {
    open: undefined,
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DemoEffect,
        provideMockActions(() => actions$),
        {
          provide: MatSnackBar,
          useValue: matSnackBar,
        },
      ],
    });
  });

  it('should log payload', () => {
    const effects = TestBed.inject(DemoEffect);
    actions$ = cold('a', { a: MyIncrementAction({ payload: { counter: 1 } }) });
    expect(effects.logActions$).toBeObservable(
      cold('a', { a: MyIncrementAction({ payload: { counter: 1 } }) })
    );
    expect(matSnackBar.open).toHaveBeenCalledWith(
      'counter increment: 1',
      undefined,
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'snackbar',
        duration: 2000,
      }
    );
  });
});
