import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  MyState,
  OptionSkipSameActionsComponent,
} from './option-skip-same-actions.component';

describe('OptionSkipSameActionsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): OptionSkipSameActionsComponent => {
    const fixture = TestBed.createComponent(OptionSkipSameActionsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state and run same effect only one times', () => {
      const component = getComponent();

      component.increment(1);
      component.increment(1);

      component.increment(2);
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
  describe('incrementOne', () => {
    it('should set state to 1 and run effect only one times', () => {
      const component = getComponent();

      component.incrementOne();

      component.incrementOne();

      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 1,
          },
        }),
      );
      expect(component.executeEffect).toBe(1);
    });
  });
});
