import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  LoadingWithDefaultValuesComponent,
  MyState,
} from './loading-with-default-values.component';

describe('LoadingWithDefaultValuesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): LoadingWithDefaultValuesComponent => {
    const fixture = TestBed.createComponent(LoadingWithDefaultValuesComponent);
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

      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 0,
          },
        })
      );

      component.increment();
      tick(400);
      component.increment();
      tick(400);
      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: {
            counter: 2,
          },
        })
      );
    }));
  });
});
