---
sidebar_position: 5
---

# Testing

Import `storeTestingFactory` as a provider in your test, to mock the redux store.

```ts title="component.spec.ts"
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { MyComponent } from './my.component';

TestBed.configureTestingModule({
  declarations: [MyComponent],
  providers: [storeTestingFactory()],
});
```

:::note Many Test Example you can
find [here](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app)
:::

## test createEffects

```ts title="component.spec.ts"
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory, actions$ } from '@gernsdorfer/ngrx-lite/testing';
import { MyComponent } from './my.component';

export const resetAction = createAction('reset');

it('should trigger an eaction', () => {
  actions$.next(resetAction());

  //check your state
});
```

## Mock Functional Stores

To Test a lazy Functional Store, you can use `createStoreAsFnTest` to create a mock of your store.

:::note Many Test Example you can
find [here](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/functional-store)
:::

```ts title="component.spec.ts"
import { DynamicState, dynamicStore } from './dynamic-store';
// get store class Interface
type MyStoreInterface = createStoreAsFnTest<typeof dynamicStore>;

// create store Spy
const dynamicStoreSpy = createSpyObj<MyStoreInterface>({ increment: undefined });
// spy on store
spyOn(dynamicStore, 'inject').and.returnValue(dynamicStoreSpy);
```
