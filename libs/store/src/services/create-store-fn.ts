import {
  DestroyRef,
  inject,
  Injectable,
  Injector,
  OnDestroy,
  Type,
} from '@angular/core';
import { DynamicStoreName } from '../injection-tokens/state.token';

export class DynamicStore<T extends string = string> {
  dynamicStoryName?: T;
}
type GLOBAL_STORE = Injectable & { providedIn: 'root' | 'platform' };
type StoreType<STORE extends Injectable> = STORE extends GLOBAL_STORE
  ? DynamicStore<never>
  : OnDestroy & DynamicStore;

export class CreateStoreAsFn<
  INJECTION extends Injectable,
  STORE extends StoreType<INJECTION>,
> {
  constructor(
    private store: Type<STORE>,
    private injectionOptions?: INJECTION,
  ) {}

  inject(
    dynamicStoreName?: INJECTION extends {
      providedIn: 'root' | 'platform' | 'any';
    }
      ? never
      : STORE['dynamicStoryName'],
  ): STORE {
    return (
      this.loadFromRoot() ||
      this.storeNotFoundHandling(
        this.injectionOptions?.providedIn === 'root',
      ) ||
      this.createNewStoreInstance(dynamicStoreName)
    );
  }

  private loadFromRoot() {
    return inject(this.store, { optional: true });
  }

  private createNewStoreInstance(dynamicStoreName?: string): STORE {
    const storeInstance = Injector.create({
      parent: inject(Injector),
      providers: [
        this.store,
        { provide: DynamicStoreName, useValue: dynamicStoreName },
      ],
    }).get<StoreType<{ providedIn: null }>>(this.store);
    const destroy = inject(DestroyRef);
    destroy.onDestroy(() => storeInstance.ngOnDestroy());
    return storeInstance as STORE;
  }

  private storeNotFoundHandling(shouldTriggerError: boolean) {
    if (shouldTriggerError)
      throw new Error(`Store not found: ${this.store.name}`);
  }
}

export const createStoreAsFn = <
  INJECTION extends Injectable,
  STORE extends INJECTION extends GLOBAL_STORE
    ? object
    : OnDestroy & DynamicStore,
>(
  store: Type<STORE>,
  injectionOptions?: INJECTION,
) => new CreateStoreAsFn<INJECTION, STORE>(store, injectionOptions);
