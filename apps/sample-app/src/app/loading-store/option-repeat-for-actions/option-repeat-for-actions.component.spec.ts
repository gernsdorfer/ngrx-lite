import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  MyState,
  OptionRepeatForActionsComponent,
} from './option-repeat-for-actions.component';

describe('OptionSkipSamePendingActionsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): OptionRepeatForActionsComponent => {
    const fixture = TestBed.createComponent(OptionRepeatForActionsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state and skip same pending actions', fakeAsync(() => {
      const component = getComponent();

      component.increment(1);
      tick(1000);
      component.increment(1);

      component.increment(2);
      tick(4000);
      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 2,
          },
        }),
      );
      expect(component.executeEffect).toBe(2);
    }));
  });
});
