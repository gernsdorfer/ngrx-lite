---
sidebar_position: 4
---

# Testing

Add `storeTestingFactory` to your providers to mock the redux store.

```ts title="component.spec.ts"
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      // standalone components go into imports
      imports: [MyComponent],
      providers: [storeTestingFactory()],
    });
  });

  it('should patch the state', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.increment(2);

    // state is a Signal
    expect(component.counterState()).toEqual({ counter: 2 });
  });
});
```

`storeTestingFactory()` provides `provideMockStore`, `provideMockActions` and the real `StoreFactory`.

:::note Many test examples you can
find [here](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app)
:::

## Assert on a loading store

Use [`getDefaultComponentLoadingState`](/docs/api/component-loading-store#getdefaultcomponentloadingstate) so you
don't have to spell out `isLoading` and `error` in every expectation.

```ts title="component.spec.ts"
import { getDefaultComponentLoadingState } from '@gernsdorfer/ngrx-lite';

it('should load the item', () => {
  const component = getComponent();

  component.load('my name');

  expect(component.state()).toEqual(
    getDefaultComponentLoadingState<State['item'], State['error']>({
      item: { name: 'my name' },
    }),
  );
});
```

## Test `createEffect`

The exported `actions$` subject is how you dispatch into an effect.

```ts title="component.spec.ts"
import { actions$, storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { createAction } from '@ngrx/store';

export const resetAction = createAction('reset');

it('should react on the reset action', () => {
  const component = getComponent();

  actions$.next(resetAction());

  expect(component.counterState()).toEqual({ counter: 0 });
});
```

## Mock functional stores

To test a lazy functional store, use `createStoreAsFnTest` to derive the store interface, then mock `inject`.

:::note Many test examples you can
find [here](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/component-store/functional-store)
:::

```ts title="component.spec.ts"
import { createStoreAsFnTest } from '@gernsdorfer/ngrx-lite/testing';
import { vi } from 'vitest';
import { dynamicStore } from './dynamic-store';

// get the store class interface
type MyStoreInterface = createStoreAsFnTest<typeof dynamicStore>;

// create a store mock
const dynamicStoreSpy = {
  increment: vi.fn(),
} as unknown as MyStoreInterface;

// mock the injection
vi.spyOn(dynamicStore, 'inject').mockReturnValue(dynamicStoreSpy);
```

:::note
This repository runs on [Vitest](https://vitest.dev). If your project uses Jasmine or Jest, replace `vi.fn()` and
`vi.spyOn(…).mockReturnValue(…)` with the equivalents of your runner.
:::
