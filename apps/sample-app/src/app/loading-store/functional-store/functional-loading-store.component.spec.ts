import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import {
  createStoreAsFnTest,
  storeTestingFactory,
} from '@gernsdorfer/ngrx-lite/testing';
import { DynamicState, dynamicStore } from './dynamic-store';
import { FunctionalLoadingStoreComponent } from './functional-loading-store.component';
import { rootStore } from './root-store';
import createSpyObj = jasmine.createSpyObj;

describe('FunctionalLoadingStoreComponent', () => {
  const dynamicState = signal<DynamicState>(
    getDefaultComponentLoadingState({}),
  );
  let onLazyStoreBSuccess: () => void;
  const dynamicStoreSpy = createSpyObj<
    createStoreAsFnTest<typeof dynamicStore>
  >({ increment: undefined }, { state: dynamicState });

  const rootStoreSpy = createSpyObj<createStoreAsFnTest<typeof rootStore>>(
    {
      onLazyStoreBSuccess: undefined,
    },
    {},
  );
  rootStoreSpy.onLazyStoreBSuccess.and.callFake(
    (cb: () => void) => (onLazyStoreBSuccess = cb),
  );
  beforeEach(() => {
    spyOn(dynamicStore, 'inject').and.returnValue(dynamicStoreSpy);
    spyOn(rootStore, 'inject').and.returnValue(rootStoreSpy);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });
  const getComponent = (): FunctionalLoadingStoreComponent => {
    const fixture = TestBed.createComponent(FunctionalLoadingStoreComponent);
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
