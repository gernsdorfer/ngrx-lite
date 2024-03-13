import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';
import {
  createStoreAsFnTest,
  storeTestingFactory,
} from '@gernsdorfer/ngrx-lite/testing';
import { DynamicState, dynamicStore } from './dynamic-store';
import { rootStore } from './root-store';
import { StoreFunctionComponent } from './store-function.component';
import createSpyObj = jasmine.createSpyObj;

describe('LoadingWithSignalEffectsComponent', () => {
  const dynamicState = signal<DynamicState>(
    getDefaultComponentLoadingState({}),
  );
  let onStoreBSuccess: () => void;
  const dynamicStoreSpy = createSpyObj<
    createStoreAsFnTest<typeof dynamicStore>
  >({ increment: undefined }, { state: dynamicState });

  const rootStoreSpy = createSpyObj<createStoreAsFnTest<typeof rootStore>>(
    {
      onDynamicStoreASuccess: undefined,
    },
    {},
  );
  rootStoreSpy.onDynamicStoreASuccess.and.callFake(
    (cb: () => void) => (onStoreBSuccess = cb),
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
  const getComponent = (): StoreFunctionComponent => {
    const fixture = TestBed.createComponent(StoreFunctionComponent);
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
      getComponent();
      const logSpy = spyOn(console, 'log');
      onStoreBSuccess();

      expect(logSpy).toHaveBeenCalledWith(
        'Root knows the StoreA Increment Successfully',
      );
    });
  });
});
