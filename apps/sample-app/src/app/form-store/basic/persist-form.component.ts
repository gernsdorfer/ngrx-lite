import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Product {
  name: string;
}

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'persist-form.html',
})
export class PersistFormComponent implements OnDestroy {
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    formGroup: this.productForm,
  });

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
