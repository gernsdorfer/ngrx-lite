import { TestBed } from '@angular/core/testing';
import {
  CombineWithEntityComponent,
  mockProducts,
} from './combine-with-entity.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('CombineWithEntityComponent', () => {
  const getComponent = (): CombineWithEntityComponent => {
    const fixture = TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
    })
      .overrideComponent(CombineWithEntityComponent, {
        set: {
          imports: [CommonModule],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .createComponent(CombineWithEntityComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should load products', () => {
      const component = getComponent();

      expect(component.products$).toBeObservable(
        cold('a', {
          a: mockProducts,
        })
      );
    });
  });

  describe('selectProduct', () => {
    it('should set form', () => {
      const component = getComponent();
      const [firstProduct] = mockProducts;

      component.selectProduct(firstProduct.id);

      expect(component.productForm.getRawValue()).toEqual(firstProduct);
    });
  });

  describe('remove', () => {
    it('should remove product from product list', () => {
      const component = getComponent();
      const [firstProduct, ...otherProducts] = mockProducts;

      component.remove(firstProduct);

      expect(component.products$).toBeObservable(
        cold('a', {
          a: otherProducts,
        })
      );
    });
  });

  describe('storeProduct', () => {
    it('update product', () => {
      const component = getComponent();
      const [firstProduct, ...otherProducts] = mockProducts;

      component.storeProduct({ ...firstProduct, name: 'newValue' });

      expect(component.products$).toBeObservable(
        cold('a', {
          a: [{ ...firstProduct, name: 'newValue' }, ...otherProducts],
        })
      );
    });

    it('create product', () => {
      const component = getComponent();

      component.storeProduct({ name: 'newValue', id: 0 });

      expect(component.products$).toBeObservable(
        cold('a', {
          a: [...mockProducts, { name: 'newValue', id: 4 }],
        })
      );
    });
  });

  describe('resetProductForm', () => {
    it('should reset product form', () => {
      const component = getComponent();
      component.productForm.patchValue({ name: 'test' });

      component.resetProductForm();

      expect(component.productForm.getRawValue()).toEqual({
        id: 0,
        name: '',
      });
    });
  });
});
