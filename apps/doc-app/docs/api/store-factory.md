---
sidebar_position: 1
---

# StoreFactory

`StoreFactory` is provided in `root` and is the single entry point of the library. Inject it with `inject()`:

```ts
private storeFactory = inject(StoreFactory);
```

All three factory methods share these options:

| OptionName     | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| `storeName`    | name of the store — also the key in the global store and the DevTools |
| `defaultState` | initial state (optional for `createComponentLoadingStore`)            |
| `skipLog`      | skip all log entries for the created store                            |
| `plugins`      | define plugins ( [ClientStoragePlugin](/docs/plugins/storage))        |

## `createComponentStore` {#createcomponentstore}

Create a store based on the [NgRx Component Store](https://ngrx.io/guide/component-store).
See [ComponentStore](/docs/api/component-store) for the full API.

```ts title="app.component.ts"
import { Component, inject, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

export interface MyState {
  counter: number;
}

@Component({
  /* ... */
})
export class AppComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'BASIC_COUNTER',
    defaultState: { counter: 0 },
  });

  public counterState = this.store.state;

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

## `createComponentLoadingStore` {#createcomponentloadingstore}

Create a store that tracks `isLoading`, `item` and `error` for asynchronous work.
See [ComponentLoadingStore](/docs/api/component-loading-store) for the full API.

`defaultState` is optional here and only takes `item` and `error` — `isLoading` is managed by the library.

```ts title="app.component.ts"
import { Component, inject, OnDestroy } from '@angular/core';
import { LoadingStoreState, StoreFactory } from '@gernsdorfer/ngrx-lite';
import { of } from 'rxjs';

type MyState = LoadingStoreState<{ counter: number }, { message: string }>;

@Component({
  /* ... */
})
export class AppComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  private store = this.storeFactory.createComponentLoadingStore<MyState['item'], MyState['error']>({
    storeName: 'LOADING_STORE',
    defaultState: { item: { counter: 0 } },
  });

  public counterState = this.store.state;

  increment = this.store.loadingEffect('INCREMENT', (counter: number) => of({ counter: counter + 1 }));

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

## `createFormComponentStore` {#createformcomponentstore}

Create a store that is kept in sync with an Angular `FormGroup` in both directions.
See [FormStore](/docs/api/form-store) for details.

```ts title="persist-form.component.ts"
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

interface Product {
  name: string;
  lastName: string;
}

@Component({
  /* ... */
})
export class PersistFormComponent {
  private storeFactory = inject(StoreFactory);

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    formGroup: this.productForm,
    plugins: { storage: 'sessionStoragePlugin' },
  });
}
```

:::note
`createFormComponentStore` takes no `defaultState` — the initial value comes from the `FormGroup`
(or from the storage plugin, when one is configured).
:::
