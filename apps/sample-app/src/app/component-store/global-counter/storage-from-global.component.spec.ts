import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createVitestSpyObj } from '@ngrx-lite/testing';
import { vi } from 'vitest';
import { GlobalCounterStore } from './global-counter.service';
import { StorageFromGlobalComponent } from './storage-from-global.component';

describe('StorageFromGlobalComponent', () => {
  const globalCounterStore = createVitestSpyObj<GlobalCounterStore>({
    increment: vi.fn(),
    state: signal({ counter: 0 }),
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalCounterStore, useValue: globalCounterStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  const getComponent = (): StorageFromGlobalComponent => {
    const fixture = TestBed.createComponent(StorageFromGlobalComponent);
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
      globalCounterStore.increment.mockClear();

      component.increment();

      expect(globalCounterStore.increment).toHaveBeenCalled();
    });
  });
});
