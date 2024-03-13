import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { dynamicStore } from './dynamic-store';
import createSpyObj = jasmine.createSpyObj;

describe('RootStore', () => {
  const store = () =>
    TestBed.runInInjectionContext(() => dynamicStore.inject());
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const service = store();

      service.increment(1);

      expect(service.state()).toEqual(
        getDefaultComponentLoadingState({
          item: { counter: 1 },
        }),
      );
    });
  });
});
