import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private apiUrl = 'https://api-jogo-alpha.vercel.app/products'; // URL de la API desplegada en Vercel
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe(data => {
      this.products = data;
      this.productsSubject.next(this.products);
    });
  }

  private saveProducts() {
    this.http.post(this.apiUrl, this.products, this.httpOptions).subscribe(
      response => {
        console.log('Productos guardados con éxito', response);
      },
      error => {
        console.error('Error al guardar productos', error);
      }
    );
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    product.id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    this.products.push(product);
    this.saveProducts();
    this.productsSubject.next(this.products);
  }

  updateProduct(index: number, product: Product) {
    this.products[index] = product;
    this.saveProducts();
    this.productsSubject.next(this.products);
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.saveProducts();
    this.productsSubject.next(this.products);
  }
}
