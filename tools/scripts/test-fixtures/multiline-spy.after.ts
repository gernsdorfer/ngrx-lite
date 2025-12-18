import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createStoreAsFnTest } from '@gernsdorfer/ngrx-lite/testing';
import { DynamicState, dynamicStore } from './dynamic-store';

describe('FunctionalStoreComponent', () => {
  const dynamicState = signal<DynamicState>({});

  const dynamicStoreSpy = vi.mocked<createStoreAsFnTest<typeof dynamicStore>>({
    increment: vi.fn(),
    state: dynamicState
  });

  const rootStoreSpy = vi.mocked<createStoreAsFnTest<typeof rootStore>>({
    onLazyStoreBSuccess: vi.fn()
  });

  it('should increment', () => {
    dynamicStoreSpy.increment(5);
    expect(dynamicStoreSpy.increment).toHaveBeenCalledWith(5);
  });
});
