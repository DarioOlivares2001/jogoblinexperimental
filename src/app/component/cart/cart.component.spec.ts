import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

class MockCartService {
  items$ = of([
    { id: 1, name: 'Product 1', price: 10, quantity: 1 },
    { id: 2, name: 'Product 2', price: 20, quantity: 2 }
  ]);

  changeQuantity(id: number, action: string) {}
  getTotal() {
    return 50;
  }
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger total jump animation', () => {
    component.changeQuantity(1, 'mas');
    fixture.detectChanges();

    const totalElement = fixture.nativeElement.querySelector('.total');
    expect(totalElement.classList.contains('total-update')).toBeTrue();
  });

  // Otras pruebas aquí...
});
