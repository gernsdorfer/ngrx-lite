import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createStoreAsFnTest,
  storeTestingFactory,
} from '@gernsdorfer/ngrx-lite/testing';
import { createVitestSpyObj } from '@ngrx-lite/testing';
import { vi } from 'vitest';
import { DynamicState, dynamicStore } from './dynamic-store';
import { FunctionalStoreComponent } from './functional-store.component';
import { rootStore } from './root-store';

describe('FunctionalLoadingStoreComponent', () => {
  const dynamicState = signal<DynamicState>({ counter: 0 });
  let onLazyStoreBSuccess: () => void;
  const dynamicStoreSpy = createVitestSpyObj<
    createStoreAsFnTest<typeof dynamicStore>
  >({
    increment: vi.fn(),
    state: dynamicState,
  });

  const rootStoreSpy = createVitestSpyObj<
    createStoreAsFnTest<typeof rootStore>
  >({
    onLazyStoreBSuccess: vi.fn(),
  });
  rootStoreSpy.onLazyStoreBSuccess.mockImplementation(
    (cb: () => void) => (onLazyStoreBSuccess = cb),
  );
  beforeEach(() => {
    vi.spyOn(dynamicStore, 'inject').mockReturnValue(dynamicStoreSpy);
    vi.spyOn(rootStore, 'inject').mockReturnValue(rootStoreSpy);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): FunctionalStoreComponent => {
    const fixture = TestBed.createComponent(FunctionalStoreComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('incrementStoreB', () => {
    it('should call store.increment', () => {
      const component = getComponent();

      component.incrementStoreB();

      expect(dynamicStoreSpy.increment).toHaveBeenCalled();
    });
  });

  describe('onStoreBSuccess', () => {
    it('should call store.onStoreASuccess', () => {
      const component = getComponent();

      onLazyStoreBSuccess();

      expect(component.lazyStoreBSuccess).toBe(
        'Root Store knows the StoreA Increment Successfully',
      );
    });
  });
});
