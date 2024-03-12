import { DestroyRef, inject, Injector, OnDestroy, Type } from '@angular/core';
import { DynamicStoreName } from '../injection-tokens/state.token';

const loadFromRoot = <STORE>(store: Type<STORE>) =>
  inject(store, { optional: true });

const createNewStoreInstance = <STORE extends OnDestroy>(
  store: Type<STORE>,
  dynamicStoreName?: string,
) => {
  const storeInstance = Injector.create({
    parent: inject(Injector),
    providers: [
      store,
      { provide: DynamicStoreName, useValue: dynamicStoreName },
    ],
  }).get(store);
  const destroy = inject(DestroyRef);
  destroy.onDestroy(() => storeInstance.ngOnDestroy());
  return storeInstance;
};

export const createStoreFn = <
  ARGS extends string = never,
  STORE extends OnDestroy = { ngOnDestroy: () => void },
>(
  store: Type<STORE>,
) => ({
  inject: (dynamicStoreName?: ARGS) => {
    return (
      loadFromRoot(store) || createNewStoreInstance(store, dynamicStoreName)
    );
  },
});
