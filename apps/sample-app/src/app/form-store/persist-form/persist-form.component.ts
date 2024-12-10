import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { UiCardComponent } from '../../shared/ui/card-component';

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'persist-form.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    UiCardComponent,
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

  private store = this.storeFactory.createFormComponentStore<{
    name: string;
  }>({
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
