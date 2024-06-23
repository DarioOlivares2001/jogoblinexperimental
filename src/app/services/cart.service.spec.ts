import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100 };
    service.addToCart(product);
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should increase the quantity of an existing product in the cart', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100 };
    service.addToCart(product);
    service.addToCart(product);
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should change the quantity of a product in the cart', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100 };
    service.addToCart(product);
    service.changeQuantity(1, 'mas');
    service.items$.subscribe(items => {
      expect(items[0].quantity).toBe(2);
    });
    service.changeQuantity(1, 'menos');
    service.items$.subscribe(items => {
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should remove a product from the cart if quantity is decreased to zero', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100 };
    service.addToCart(product);
    service.changeQuantity(1, 'menos');
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should save cart to localStorage', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100 };
    service.addToCart(product);
    expect(localStorage.getItem('cart')).toBeTruthy();
  });

  it('should get cart from localStorage', () => {
    const product = { id: 1, nombre: 'Product 1', precio: 100, quantity: 1 };
    localStorage.setItem('cart', JSON.stringify([product]));
    const newService = new CartService();
    newService.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(product.id);
    });
  });

  it('should calculate the total', () => {
    const product1 = { id: 1, nombre: 'Product 1', precio: 100, quantity: 1 };
    const product2 = { id: 2, nombre: 'Product 2', precio: 200, quantity: 2 };
    service.addToCart(product1);
    service.addToCart(product2);
    service.items$.subscribe(() => {
      expect(service.getTotal()).toBe(500);
    });
  });
});
