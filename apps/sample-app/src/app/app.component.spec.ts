import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { getDefaultState, StoreState } from '@gernsdorfer/ngrx-lite';
import { cold } from 'jasmine-marbles';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [storeTestingFactory()],
    }).compileComponents();
  });

  const getApp = () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      component,
    };
  };

  describe('increment', () => {
    it('should auto increment', () => {
      const { component } = getApp();

      component.increment(undefined);

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <StoreState<number, never>>{ ...getDefaultState(), item: 1 },
        })
      );
    });

    it('should increment current item', () => {
      const { component } = getApp();

      component.increment(1);

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <StoreState<number, never>>{ ...getDefaultState(), item: 2 },
        })
      );
    });
  });

  describe('reset', () => {
    it('reset state ', () => {
      const { component } = getApp();
      component.increment(1);

      component.reset();

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <StoreState<number, never>>{ ...getDefaultState() },
        })
      );
    });
  });
});
