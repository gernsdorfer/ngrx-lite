import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { UiCardComponent } from '../../shared/ui/card-component';

interface Product {
  id: number;
  name: string;
}

export type MyState = EntityState<Product>;

const adapter = createEntityAdapter<Product>();
const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

const getProduct = (product: Partial<Product>): Product => ({
  id: 1,
  name: '',
  ...product,
});
export const mockProducts = [
  getProduct({ id: 1, name: 'Product 1' }),
  getProduct({ id: 2, name: 'Product 2' }),
  getProduct({ id: 3, name: 'Product 3' }),
];

@Component({
  selector: 'my-app-entity-app',
  templateUrl: 'combine-with-entity.html',
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
export class CombineWithEntityComponent implements OnDestroy, OnInit {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'ENTITY_EXAMPLE',
    defaultState: adapter.getInitialState({}),
  });
  products = this.store.selectSignal(selectAll);

  productForm = new FormGroup({
    id: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private storeFactory: StoreFactory) {}

  ngOnInit() {
    this.store.setState((state) => adapter.setAll(mockProducts, state));
  }

  selectProduct(productId: number) {
    this.productForm.reset(selectEntities(this.store.state())[productId]);
  }

  remove(product: Product) {
    this.store.setState(adapter.removeOne(product.id, this.store.state()));
    this.resetProductForm();
  }

  storeProduct(product: Product): void {
    product.id
      ? this.updateProduct(product)
      : this.addProduct({
          ...product,
          id: selectTotal(this.store.state()) + 1,
        });
    this.resetProductForm();
  }

  resetProductForm() {
    this.productForm.reset();
  }

  private addProduct(product: Product) {
    this.store.setState(adapter.addOne(product, this.store.state()));
  }

  private updateProduct(product: Product) {
    this.store.setState(
      adapter.updateOne(
        { id: product.id, changes: product },
        this.store.state(),
      ),
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
