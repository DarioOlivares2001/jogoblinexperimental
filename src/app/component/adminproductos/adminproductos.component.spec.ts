import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminproductosComponent } from './adminproductos.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock ProductService
class MockProductService {
  private products = [
    { id: 1, nombre: 'Producto 1', precio: 100, image: 'image1.jpg' },
    { id: 2, nombre: 'Producto 2', precio: 200, image: 'image2.jpg' }
  ];

  products$ = of(this.products);

  getProducts() {
    return this.products;
  }

  addProduct(product: any) {
    this.products.push(product);
  }

  updateProduct(index: number, product: any) {
    this.products[index] = product;
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
  }
}

describe('AdminproductosComponent', () => {
  let component: AdminproductosComponent;
  let fixture: ComponentFixture<AdminproductosComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminproductosComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useClass: MockProductService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminproductosComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products on ngOnInit', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
  });

  it('should reset form and variables on newProduct', () => {
    component.newProduct();
    expect(component.isEdit).toBeFalse();
    expect(component.productForm.valid).toBeFalse();
    expect(component.imageSrc).toBeNull();
  });

  it('should populate form on editProduct', () => {
    component.editProduct(0);
    expect(component.isEdit).toBeTrue();
    expect(component.productForm.value.nombre).toBe('Producto 1');
    expect(component.productForm.value.precio).toBe(100);
    expect(component.imageSrc).toBe('image1.jpg');
  });

  it('should call deleteProduct on ProductService when deleteProduct is called', () => {
    spyOn(productService, 'deleteProduct').and.callThrough();
    component.deleteProduct(0);
    expect(productService.deleteProduct).toHaveBeenCalledWith(0);
    expect(component.products.length).toBe(1);
  });

  it('should call addProduct on ProductService when saveProduct is called for a new product', () => {
    spyOn(productService, 'addProduct').and.callThrough();
    component.productForm.setValue({ nombre: 'Nuevo Producto', precio: 300 });
    component.saveProduct();
    expect(productService.addProduct).toHaveBeenCalled();
    expect(component.products.length).toBe(3);
  });

  it('should call updateProduct on ProductService when saveProduct is called for an existing product', () => {
    spyOn(productService, 'updateProduct').and.callThrough();
    component.editProduct(0);
    component.productForm.setValue({ nombre: 'Producto Actualizado', precio: 150 });
    component.saveProduct();
    expect(productService.updateProduct).toHaveBeenCalledWith(0, jasmine.objectContaining({ nombre: 'Producto Actualizado', precio: 150 }));
    expect(component.products[0].nombre).toBe('Producto Actualizado');
  });

  it('should set imageSrc on file change', () => {
    const mockEvent = { target: { files: [{ name: 'new-image.jpg' }] } };
    component.onFileChange(mockEvent);
    expect(component.imageSrc).toBe('assets/images/new-image.jpg');
  });

  it('should set selectedProduct on viewProduct', () => {
    const product = { id: 1, nombre: 'Producto 1', precio: 100, image: 'image1.jpg' };
    component.viewProduct(product);
    expect(component.selectedProduct).toBe(product);
  });
});
