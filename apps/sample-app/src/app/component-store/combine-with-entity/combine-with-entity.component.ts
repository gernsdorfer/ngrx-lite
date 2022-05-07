import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreFactory } from '@gernsdorfer/ngrx-lite';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { map } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

@Component({
  selector: 'my-app-basic-app',
  templateUrl: 'combine-with-entity.html',
})
export class CombineWithEntityComponent implements OnDestroy, OnInit {
  private store = this.storeFactory.createComponentStore<MyState>({
    storeName: 'ENTIY_EXAMPLE',
    defaultState: adapter.getInitialState({}),
  });
  products$ = this.store.select(selectAll);

  loadProducts = this.store.effect((load$) =>
    load$.pipe(
      map(() => [
        getProduct({ id: 1, name: 'product1' }),
        getProduct({ id: 2, name: 'product2' }),
        getProduct({ id: 3, name: 'product3' }),
      ]),
      tapResponse(
        (products) =>
          this.store.setState((state) => adapter.setAll(products, state)),
        (e) => console.error(e)
      )
    )
  );

  productForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  constructor(private storeFactory: StoreFactory) {}

  ngOnInit() {
    this.loadProducts();
  }

  selectProduct(productId: number) {
    this.productForm.reset(selectEntities(this.store.state)[productId]);
  }

  remove(product: Product) {
    this.store.setState(adapter.removeOne(product.id, this.store.state));
    this.resetProductForm();
  }

  storeProduct(product: Product) {
    product.id
      ? this.updateProduct(product)
      : this.addProduct({
          ...product,
          id: selectTotal(this.store.state) + 1,
        });
    this.resetProductForm();
  }

  resetProductForm () {
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
