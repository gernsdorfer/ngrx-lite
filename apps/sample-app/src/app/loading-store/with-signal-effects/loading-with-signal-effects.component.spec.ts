import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { vi } from 'vitest';
import {
  LoadingWithSignalEffectsComponent,
  MyState,
} from './loading-with-signal-effects.component';

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
    it('should increment state', async () => {
      const component = getComponent();
      vi.useFakeTimers();

      vi.advanceTimersByTime(1);
      vi.runAllTicks();
      expect(component.counterState()).toEqual(
        getDefaultComponentLoadingState<MyState['item'], MyState['error']>({
          item: { counter: 0 },
        }),
      );
    });
  });
  describe('increment', () => {
    it('should increment state', () => {
      const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');
      const component = getComponent();

      component.increment();

      expect(navigateSpy).toHaveBeenCalled();
    });
  });
});
