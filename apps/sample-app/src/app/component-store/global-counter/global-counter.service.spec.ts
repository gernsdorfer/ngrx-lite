import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { GlobalCounterStore } from './global-counter.service';

describe('GlobalCounterStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const service = TestBed.inject(GlobalCounterStore);

      service.increment();

      expect(service.state()).toEqual({
        counter: 1,
      });
    });
  });
});
