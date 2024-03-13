import { inject, Injectable, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { createStoreAsFn, DynamicStore } from './create-store-fn';
import { StoreFactory } from './store-factory.service';

@Injectable({ providedIn: 'root' })
class RootStore {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<number, never>({
    storeName: 'FunctionRootStore',
  });

  getStore() {
    return this.store;
  }
}

@Injectable()
class LazyStore extends DynamicStore<'test1' | 'test2'> implements OnDestroy {
  private storeFactory = inject(StoreFactory);
  private store = this.storeFactory.createComponentLoadingStore<number, never>({
    storeName: 'FunctionRootStore',
  });

  getStore() {
    return this.store;
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}

describe('createStoreAsFn', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
    }),
  );

  describe('root Service', () => {
    it('should return store', () => {
      const rootStore = createStoreAsFn(RootStore, { providedIn: 'root' });
      const rootStore2 = createStoreAsFn(RootStore, { providedIn: 'root' });

      expect(
        TestBed.runInInjectionContext(() => rootStore.inject()),
      ).toBeInstanceOf(RootStore);
      expect(TestBed.runInInjectionContext(() => rootStore2.inject())).toEqual(
        TestBed.runInInjectionContext(() => rootStore.inject()),
      );
    });
  });

  describe('lazy Service', () => {
    it('should return a new store instance', () => {
      const lazyStore = createStoreAsFn(LazyStore);
      const lazyStore2 = createStoreAsFn(LazyStore);

      expect(
        TestBed.runInInjectionContext(() => lazyStore.inject('test1')),
      ).toBeInstanceOf(LazyStore);
      expect(
        TestBed.runInInjectionContext(() => lazyStore2.inject()),
      ).not.toEqual(TestBed.runInInjectionContext(() => lazyStore.inject()));
    });
  });

  describe('wrong configured Service', () => {
    it('should throw error for wrong provied service', () => {
      const lazyStore = createStoreAsFn(LazyStore, { providedIn: 'root' });

      expect(() =>
        TestBed.runInInjectionContext(() => lazyStore.inject()),
      ).toThrowError('Store not found: LazyStore');
    });
  });
});
