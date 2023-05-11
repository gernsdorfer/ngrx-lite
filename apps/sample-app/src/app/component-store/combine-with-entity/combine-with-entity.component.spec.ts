import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {
  CombineWithEntityComponent,
  mockProducts,
} from './combine-with-entity.component';

describe('CombineWithEntityComponent', () => {
  const getComponent = (): CombineWithEntityComponent => {
    const fixture = TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      imports: [BrowserAnimationsModule],
    }).createComponent(CombineWithEntityComponent);
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

      expect(component.products()).toEqual(mockProducts);
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

      expect(component.products()).toEqual(otherProducts);
    });
  });

  describe('storeProduct', () => {
    it('update product', () => {
      const component = getComponent();
      const [firstProduct, ...otherProducts] = mockProducts;

      component.storeProduct({ ...firstProduct, name: 'newValue' });

      expect(component.products()).toEqual([
        { ...firstProduct, name: 'newValue' },
        ...otherProducts,
      ]);
    });

    it('create product', () => {
      const component = getComponent();

      component.storeProduct({ name: 'newValue', id: 0 });

      expect(component.products()).toEqual([
        ...mockProducts,
        { name: 'newValue', id: 4 },
      ]);
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
