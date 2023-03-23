import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { CounterStore, MyState } from './counter-service';

describe('CounterStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [CounterStore, storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const service = TestBed.inject(CounterStore);

      service.increment();

      expect(service.counterState$).toBeObservable(
        cold('a', {
          a: <MyState>{
            counter: 1,
          },
        })
      );
    });
  });
});
