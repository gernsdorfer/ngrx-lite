import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createVitestSpyObj } from '../../../test-setup';
import { MultipleCounterStore } from './counter-service';
import { DemoBComponent } from './demo-b.component';

describe('DemoBComponent', () => {
  const multipleCounterStore = createVitestSpyObj<MultipleCounterStore>({
    increment: vi.fn(),
    ngOnDestroy: vi.fn(),
    state: signal({ counter: 0 }),
  });

  const getComponent = (): DemoBComponent => {
    const fixture = TestBed.overrideComponent(DemoBComponent, {
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
    }).createComponent(DemoBComponent);
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
});
