import { Component, OnDestroy } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {UiModule} from "../../shared/ui/ui.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

interface Product {
  name: string;
}

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'persist-form.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    UiModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class PersistFormComponent implements OnDestroy {
  productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private store = this.storeFactory.createFormComponentStore<Product>({
    storeName: 'PRODUCT_FORM',
    plugins: {
      storage: 'sessionStoragePlugin',
    },
    formGroup: this.productForm,
    skipLog: true,
  });

  constructor(private storeFactory: StoreFactory) {}

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
