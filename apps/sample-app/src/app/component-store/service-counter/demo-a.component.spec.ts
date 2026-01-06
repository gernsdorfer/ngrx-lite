import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createVitestSpyObj } from '../../../test-setup';
import { CounterStore } from './counter-service';
import { DemoAComponent } from './demo-a.component';

describe('DemoAComponent', () => {
  const counterStore = createVitestSpyObj<CounterStore>({
    increment: vi.fn(),
    state: signal({ counter: 0 }),
  });

  const getComponent = (): DemoAComponent => {
    const fixture = TestBed.overrideComponent(DemoAComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: CounterStore,
            useValue: counterStore,
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
      counterStore.increment.mockClear();

      component.increment();

      expect(counterStore.increment).toHaveBeenCalled();
    });
  });
});
