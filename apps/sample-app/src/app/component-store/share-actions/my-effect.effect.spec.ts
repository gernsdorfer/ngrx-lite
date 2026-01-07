import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createVitestSpyObj } from '@ngrx-lite/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { vi } from 'vitest';
import { DemoEffect } from './my-effect.effect';
import { MyIncrementAction } from './shared-action.component';

describe('DemoEffectX', () => {
  let actions$ = new Observable<Action>();

  const matSnackBar = createVitestSpyObj<MatSnackBar>({
    open: vi.fn(),
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
      cold('a', { a: MyIncrementAction({ payload: { counter: 1 } }) }),
    );
    expect(matSnackBar.open).toHaveBeenCalledWith(
      'counter increment: 1',
      undefined,
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'snackbar',
        duration: 2000,
      },
    );
  });
});
