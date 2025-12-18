import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createStoreAsFnTest } from '@gernsdorfer/ngrx-lite/testing';
import { DynamicState, dynamicStore } from './dynamic-store';
import createSpyObj = jasmine.createSpyObj;

describe('FunctionalStoreComponent', () => {
  const dynamicState = signal<DynamicState>({});

  const dynamicStoreSpy = createSpyObj<
    createStoreAsFnTest<typeof dynamicStore>
  >({ increment: undefined }, { state: dynamicState });

  const rootStoreSpy = createSpyObj<createStoreAsFnTest<typeof rootStore>>(
    {
      onLazyStoreBSuccess: undefined,
    },
    {},
  );

  it('should increment', () => {
    dynamicStoreSpy.increment(5);
    expect(dynamicStoreSpy.increment).toHaveBeenCalledWith(5);
  });
});
