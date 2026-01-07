import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { LoadingBasicComponent, MyState } from './loading-basic.component';

describe('LoadingBasicComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): LoadingBasicComponent => {
    const fixture = TestBed.createComponent(LoadingBasicComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state', async () => {
      const component = getComponent();
      vi.useFakeTimers();

      component.increment();
      vi.advanceTimersByTime(400);
      vi.runAllTicks();

      component.increment();
      vi.advanceTimersByTime(400);
      vi.runAllTicks();
      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 2,
          },
        }),
      );
    });
  });
});
