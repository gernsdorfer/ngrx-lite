import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { rootStore } from './root-store';

describe('RootStore', () => {
  const store = () => TestBed.runInInjectionContext(() => rootStore.inject());
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should increment state', () => {
    const service = store();

    expect(service).toBeDefined();
  });
});
