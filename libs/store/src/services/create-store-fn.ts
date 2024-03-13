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

class Lars<
  INJECTION extends Injectable,
  STORE extends INJECTION extends GLOBAL_STORE
    ? object
    : OnDestroy & DynamicStore,
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
  ) {
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

  private createNewStoreInstance(dynamicStoreName?: string) {
    const storeInstance = Injector.create({
      parent: inject(Injector),
      providers: [
        this.store,
        { provide: DynamicStoreName, useValue: dynamicStoreName },
      ],
    }).get(this.store);
    const destroy = inject(DestroyRef);
    destroy.onDestroy(() => storeInstance.ngOnDestroy());
    return storeInstance;
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
  _injectionOptions?: INJECTION,
) => new Lars<INJECTION, STORE>(store, _injectionOptions);
