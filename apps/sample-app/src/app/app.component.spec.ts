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

  describe('counterStore', () => {
    it('should run ', () => {
      const { component } = getApp();

      component.inrement(undefined);

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <StoreState<number, never>>{ ...getDefaultState(), item: 1 },
        })
      );
    });
  });
});
