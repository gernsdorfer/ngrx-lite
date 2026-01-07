import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  MyState,
  OptionSkipSamePendingActionsComponent,
} from './option-skip-same-pending-actions.component';

describe('OptionSkipSamePendingActionsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): OptionSkipSamePendingActionsComponent => {
    const fixture = TestBed.createComponent(
      OptionSkipSamePendingActionsComponent,
    );
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state and skip same pending actions', async () => {
      const component = getComponent();
      vi.useFakeTimers();

      component.increment(1);
      vi.advanceTimersByTime(1000);
      vi.runAllTicks();

      component.increment(1);

      component.increment(2);
      vi.advanceTimersByTime(4000);
      vi.runAllTicks();

      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 2,
          },
        }),
      );
      expect(component.executeEffect).toBe(2);
    });
  });
});
