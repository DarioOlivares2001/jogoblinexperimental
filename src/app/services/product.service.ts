import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = this.loadProductsFromLocalStorage();
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  products$ = this.productsSubject.asObservable();

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private loadProductsFromLocalStorage(): Product[] {
    if (this.isLocalStorageAvailable()) {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : [];
    } else {
      return [];
    }
  }

  private saveProductsToLocalStorage() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    product.id = this.products.length + 1;
    this.products.push(product);
    this.saveProductsToLocalStorage();
    this.productsSubject.next(this.products);
  }

  updateProduct(index: number, product: Product) {
    this.products[index] = product;
    this.saveProductsToLocalStorage();
    this.productsSubject.next(this.products);
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.saveProductsToLocalStorage();
    this.productsSubject.next(this.products);
  }
}
