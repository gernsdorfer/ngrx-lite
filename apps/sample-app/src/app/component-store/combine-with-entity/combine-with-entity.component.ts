import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

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
  selector: 'my-app-basic-app',
  templateUrl: 'combine-with-entity.html',
})
export class CombineWithEntityComponent implements OnDestroy, OnInit {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'ENTITY_EXAMPLE',
    defaultState: adapter.getInitialState({}),
  });
  products$ = this.store.select(selectAll);

  productForm = new UntypedFormGroup({
    id: new UntypedFormControl('', [Validators.required]),
    name: new UntypedFormControl('', [Validators.required]),
  });

  constructor(private storeFactory: StoreFactory) {}

  ngOnInit() {
    this.store.setState((state) => adapter.setAll(mockProducts, state));
  }

  selectProduct(productId: number) {
    this.productForm.reset(selectEntities(this.store.state)[productId]);
  }

  remove(product: Product) {
    this.store.setState(adapter.removeOne(product.id, this.store.state));
    this.resetProductForm();
  }

  storeProduct(product: Product): void {
    product.id
      ? this.updateProduct(product)
      : this.addProduct({
          ...product,
          id: selectTotal(this.store.state) + 1,
        });
    this.resetProductForm();
  }

  resetProductForm() {
    this.productForm.reset();
  }

  private addProduct(product: Product) {
    this.store.setState(adapter.addOne(product, this.store.state));
  }

  private updateProduct(product: Product) {
    this.store.setState(
      adapter.updateOne({ id: product.id, changes: product }, this.store.state)
    );
  }

  ngOnDestroy() {
    this.store.ngOnDestroy();
  }
}
