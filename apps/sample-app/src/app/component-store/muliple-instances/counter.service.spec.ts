import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { MultipleCounterStore, MyState } from './counter-service';

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
