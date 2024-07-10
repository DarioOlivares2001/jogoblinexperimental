import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

/**
 * Interfaz que representa un producto.
 */
interface Product {
  id: number;
  nombre: string;
  precio: number;
  image: string;
}

/**
 * Servicio para manejar las operaciones relacionadas con productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /**
   * URL de la API.
   */
  private apiUrl = 'https://api-jogo-qucx.onrender.com'; // URL de la API desplegada en Render

  /**
   * Opciones HTTP para las solicitudes.
   */
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /**
   * Lista de productos.
   */
  private products: Product[] = [];

  /**
   * Sujeto para la lista de productos.
   */
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  products$ = this.productsSubject.asObservable();

  /**
   * Constructor del servicio de productos.
   * @param http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  /**
   * Carga los productos desde la API.
   */
  private loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(data => {
      this.products = data;
      this.productsSubject.next(this.products);
    });
  }

  /**
   * Obtiene la lista de productos.
   * @returns Lista de productos.
   */
  getProducts(): Product[] {
    return this.products;
  }

  /**
   * Añade un nuevo producto.
   * @param product - El producto a añadir.
   */
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

  /**
   * Actualiza un producto existente.
   * @param product - El producto a actualizar.
   */
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

  /**
   * Elimina un producto.
   * @param productId - El ID del producto a eliminar.
   */
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
