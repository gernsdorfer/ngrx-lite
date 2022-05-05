import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { MyIncrementAction } from './shared-action.component';
import { DemoEffect } from './my-effect.effect';

describe('DemoEffectX', () => {
  let actions$ = new Observable<Action>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoEffect, provideMockActions(() => actions$)],
    });
  });

  it('should log payload', () => {
    const effects = TestBed.inject(DemoEffect);
    const logSpy = spyOn(console, 'log');
    actions$ = cold('a', { a: MyIncrementAction({ payload: { counter: 1 } }) });
    expect(effects.logActions$).toBeObservable(
      cold('a', { a: MyIncrementAction({ payload: { counter: 1 } }) })
    );
    expect(logSpy).toHaveBeenCalledWith('receive Data', { counter: 1 });
  });
});
