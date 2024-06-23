import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  image: string;
}

declare var bootstrap: any;

@Component({
  selector: 'app-adminproductos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adminproductos.component.html',
  styleUrls: ['./adminproductos.component.css']
})
export class AdminproductosComponent implements OnInit {
  @ViewChild('productFormModal') productFormModal!: ElementRef;

  productForm: FormGroup;
  isEdit = false;
  currentIndex: number | null = null;
  imageSrc: string | null = null;
  selectedProduct: Product | null = null;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.productService.products$.subscribe(products => this.products = products);
  }

  newProduct() {
    this.isEdit = false;
    this.productForm.reset();
    this.imageSrc = null;
  }

  editProduct(index: number) {
    this.isEdit = true;
    this.currentIndex = index;
    const product = this.products[index];
    this.productForm.patchValue(product);
    this.imageSrc = product.image;
  }

  deleteProduct(index: number) {
    this.productService.deleteProduct(index);
  }

  saveProduct() {
    const newProduct: Product = {
      id: this.isEdit && this.currentIndex !== null ? this.products[this.currentIndex].id : this.products.length + 1,
      nombre: this.productForm.value.nombre,
      precio: this.productForm.value.precio,
      image: this.imageSrc || 'assets/images/Profile Icon.webp'
    };

    if (this.isEdit && this.currentIndex !== null) {
      this.productService.updateProduct(this.currentIndex, newProduct);
    } else {
      this.productService.addProduct(newProduct);
    }

    console.log('Nuevo producto agregado:', newProduct);

    this.productForm.reset();
    this.imageSrc = null;


    if (isPlatformBrowser(this.platformId) && this.productFormModal) {
      const modalInstance = bootstrap.Modal.getInstance(this.productFormModal.nativeElement);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        const newModalInstance = new bootstrap.Modal(this.productFormModal.nativeElement);
        newModalInstance.hide();
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const fileName = file.name;
      this.imageSrc = `assets/images/${fileName}`;
    }
  }

  viewProduct(product: Product) {
    this.selectedProduct = product;
  }
}
