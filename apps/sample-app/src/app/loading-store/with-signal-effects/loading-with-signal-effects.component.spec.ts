import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  LoadingWithSignalEffectsComponent,
  MyState,
} from './loading-with-signal-effects.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('LoadingWithSignalEffectsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): LoadingWithSignalEffectsComponent => {
    const fixture = TestBed.createComponent(LoadingWithSignalEffectsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
  describe('autoIncrement', () => {
    it('should increment state', fakeAsync(() => {
      const component = getComponent();

      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: { counter: 0 },
        }),
      );
    }));
  });
  describe('increment', () => {
    it('should increment state', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      const component = getComponent();

      component.increment();

      expect(navigateSpy).toHaveBeenCalled();
    });
  });
});
