import { TestBed } from '@angular/core/testing';
import { getDefaultState, StoreState } from '@gernsdorfer/ngrx-lite';
import { cold } from 'jasmine-marbles';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {CounterComponent} from "./counter.component";

describe('CounterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent],
      providers: [storeTestingFactory()],
    }).compileComponents();
  });

  const getComponent = () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      component,
    };
  };

  describe('increment', () => {
    it('should auto increment', () => {
      const { component } = getComponent();

      component.increment(undefined);

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <StoreState<number, never>>{ ...getDefaultState(), item: 1 },
        })
      );
    });

    it('should increment current item', () => {
      const { component } = getComponent();

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
      const { component } = getComponent();
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
