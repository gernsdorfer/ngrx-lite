import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingBasicComponent, MyState } from './loading-basic.component';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';

describe('LoadingBasicComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingBasicComponent],
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
