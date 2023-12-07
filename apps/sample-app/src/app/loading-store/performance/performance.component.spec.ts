import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { PerformanceComponent, MyState } from './performance.component';

describe('LoadingBasicComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): PerformanceComponent => {
    const fixture = TestBed.createComponent(PerformanceComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state', fakeAsync(() => {
      const component = getComponent();

      component.increment();
      tick(400);

      component.increment();
      tick(400);
      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 2,
          },
        }),
      );
    }));
  });
});
