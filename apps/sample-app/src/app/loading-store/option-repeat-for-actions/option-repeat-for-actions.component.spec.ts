import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  MyState,
  OptionRepeatForActionsComponent,
} from './option-repeat-for-actions.component';

describe('OptionRepeatForActionsComponent', () => {
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
    it('should increment state and skip same pending actions', async () => {
      const component = getComponent();

      component.increment(1);
      component.runSideEffect();

      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 1,
          },
        }),
      );
    });
  });
});
