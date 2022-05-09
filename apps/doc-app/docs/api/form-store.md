---
sidebar_position: 4
---

# FormStore

Store your Form data to your state to persist and debug your Form. 
The LoadingStore is based on [ngrx-lite/component-store](/docs/api/component-store) 👉 you have Features

## `createFormComponentStore`

The `state$` property is a wrapper of the [ngrx Component Store](https://ngrx.io/guide/component-store).

```ts title="app.component.ts"
interface Product {
  name: string;
}

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'persist-form.html',
})
export class PersistFormComponent implements OnDestroy {
  // Create Your Form
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  // Create A Form Store
  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    // inject your From
    formGroup: this.productForm,
    // you can skip Form Changes to the DevTool Log 
    skipLog: false
  });
}
```
