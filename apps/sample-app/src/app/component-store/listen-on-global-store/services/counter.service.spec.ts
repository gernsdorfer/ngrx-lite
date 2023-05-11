import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { actions$, storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { resetAction } from '../actions/reset.action';
import { MultipleCounterStore } from './counter-service';

describe('MultipleCounterStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [MultipleCounterStore, storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const service = TestBed.inject(MultipleCounterStore);

      service.increment();

      expect(service.state()).toEqual({
        counter: 1,
      });
    });
  });

  describe('reset', () => {
    it('should increment state', () => {
      const service = TestBed.inject(MultipleCounterStore);
      service.increment();

      actions$.next(resetAction());

      expect(service.state()).toEqual({
        counter: 0,
      });
    });
  });
});
