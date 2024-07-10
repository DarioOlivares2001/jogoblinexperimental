import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'https://api-jogo-qucx.onrender.com'; // URL de la API desplegada en Render
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
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(data => {
      this.products = data;
      this.productsSubject.next(this.products);
    });
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    this.http.post<Product>(`${this.apiUrl}/products`, product, this.httpOptions).subscribe({
      next: (response) => {
        this.products.push(response);
        this.productsSubject.next(this.products);
        console.log('Producto agregado con éxito');
      },
      error: (error) => {
        console.error('Error al agregar producto', error);
      }
    });
  }

  updateProduct(product: Product) {
    this.http.post(`${this.apiUrl}/products/update`, product, this.httpOptions).subscribe({
      next: () => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
          this.productsSubject.next(this.products);
        }
        console.log('Producto actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar producto', error);
      }
    });
  }

  deleteProduct(productId: number) {
    const url = `${this.apiUrl}/products/delete`;
    this.http.post(url, { id: productId }, this.httpOptions).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== productId);
        this.productsSubject.next(this.products);
        console.log('Producto eliminado con éxito');
      },
      error: (error) => {
        console.error('Error al eliminar el producto', error);
      }
    });
  }
}
