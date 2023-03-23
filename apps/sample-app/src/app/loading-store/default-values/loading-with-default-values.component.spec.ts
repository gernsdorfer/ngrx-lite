import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
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
    it('should increment state', () => {
      const component = getComponent();

      getTestScheduler().run((helpers) => {
        component.increment();
        helpers.flush();

        component.increment();
        expect(component.counterState$).toBeObservable(
          cold('400ms a 399ms b', {
            a: getDefaultComponentLoadingState<
              MyState['item'],
              MyState['error']
            >({
              isLoading: true,
              item: {
                counter: 1,
              },
            }),
            b: getDefaultComponentLoadingState<
              MyState['item'],
              MyState['error']
            >({
              item: {
                counter: 2,
              },
            }),
          })
        );
      });
    });
  });
});
