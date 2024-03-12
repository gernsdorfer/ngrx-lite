import { DestroyRef, inject, Injector, OnDestroy, Type } from '@angular/core';
import { DynamicStoreName } from '../injection-tokens/state.token';

export class DynamicStore<T extends string = string> {
  dynamicStoryName?: T;
}
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

const storeNotFoundHandling = <STORE extends OnDestroy>(
  shouldTriggerError: boolean,
  store: Type<STORE>,
) => {
  if (shouldTriggerError) throw new Error(`Store not found: ${store.name}`);
};

export const createStoreAsFn = <
  INJECTION extends {
    providedIn?: Type<unknown> | 'root' | 'platform' | 'any' | null;
  },
  STORE extends INJECTION extends {
    providedIn: 'root' | 'platform' | 'any';
  }
    ? object
    : OnDestroy & DynamicStore,
>(
  store: Type<STORE>,
  _injectionOptions?: INJECTION,
) => ({
  inject: (
    dynamicStoreName?: INJECTION extends {
      providedIn: 'root' | 'platform' | 'any';
    }
      ? never
      : STORE['dynamicStoryName'],
  ) =>
    loadFromRoot(store) ||
    storeNotFoundHandling(_injectionOptions?.providedIn === 'root', store) ||
    createNewStoreInstance(store, dynamicStoreName),
});
