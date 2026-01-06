import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createVitestSpyObj } from '../../../../../test-setup';
import { MultipleCounterStore } from '../../services/counter-service';
import { DemoAComponent } from './demo-a.component';

describe('DemoAComponent', () => {
  let onReset: () => void;
  const multipleCounterStore = createVitestSpyObj<MultipleCounterStore>({
    increment: vi.fn(),
    ngOnDestroy: vi.fn(),
    onReset: vi.fn(),
    state: signal({ counter: 0 }),
  });
  multipleCounterStore.onReset.mockImplementation(
    (cb: () => void) => (onReset = cb),
  );

  const getComponent = (): DemoAComponent => {
    const fixture = TestBed.overrideComponent(DemoAComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: MultipleCounterStore,
            useValue: multipleCounterStore,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(DemoAComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should call increment', () => {
      const component = getComponent();
      multipleCounterStore.increment.mockClear();

      component.increment();

      expect(multipleCounterStore.increment).toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('should increment counterReset', () => {
      const component = getComponent();
      component.counterReset = 0;

      onReset();

      expect(component.counterReset).toBe(1);
    });
  });
});
