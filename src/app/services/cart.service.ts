import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = new BehaviorSubject<any[]>(this.getCartFromLocalStorage());
  items$ = this.items.asObservable();
  private cart: any[] = this.getCartFromLocalStorage();

  addToCart(product: any) {
    const existingProductIndex = this.cart.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
      this.cart[existingProductIndex].quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.updateCart();
  }

  changeQuantity(id: number, action: string) {
    const productIndex = this.cart.findIndex(item => item.id === id);
    if (productIndex >= 0) {
      if (action === 'mas') {
        this.cart[productIndex].quantity += 1;
      } else if (action === 'menos') {
        this.cart[productIndex].quantity -= 1;
        if (this.cart[productIndex].quantity <= 0) {
          this.cart.splice(productIndex, 1);
        }
      }
      this.updateCart();
    }
  }

  private updateCart() {
    this.items.next([...this.cart]);
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  private getCartFromLocalStorage(): any[] {
    if (typeof window !== 'undefined' && localStorage) {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  }

  getTotal(){
    return this.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  }
}
