---
sidebar_position: 5
---

# FormStore

Persist and debug your form by keeping its value in a store. The FormStore is based on
[ngrx-lite/component-store](/docs/api/component-store), so you get the same API — plus a two-way sync between an
Angular `FormGroup` and the state.

[Demo](https://gernsdorfer.github.io/ngrx-lite/sample-app/#/persist-form)

[Demo-Code](https://github.com/gernsdorfer/ngrx-lite/tree/master/apps/sample-app/src/app/form-store/persist-form)

## `createFormComponentStore`

Every form change writes to the state and is logged as a `Form_CHANGED` action; every state change writes back into
the `FormGroup`. Combined with a [storage plugin](/docs/plugins/storage) the form survives a reload.

```ts title="persist-form.component.ts"
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';

interface Product {
  name: string;
  lastName: string;
}

@Component({
  selector: 'my-app-persist-form',
  templateUrl: 'persist-form.html',
  imports: [ReactiveFormsModule],
})
export class PersistFormComponent implements OnDestroy {
  private storeFactory = inject(StoreFactory);

  // create your form
  productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // create a form store
  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    // pass in your form
    formGroup: this.productForm,
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    // set to true to keep form changes out of the DevTools log
    skipLog: false,
  });

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
```

:::note
There is no `defaultState` option — the initial value comes from the `FormGroup`, or from the storage plugin
when one is configured.
:::

:::note
It's necessary to destroy your store after your component is destroyed, to avoid side effects.
Call `ngOnDestroy` on the store.
:::
