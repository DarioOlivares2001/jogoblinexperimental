import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  isAdmin$ = of(true);
  isLoggedIn$ = of(true);
  username$ = of('Test User');
  logout() {}
}

class MockCartService {
  items$ = of([
    { id: 1, name: 'Product 1', price: 10, quantity: 1 },
    { id: 2, name: 'Product 2', price: 20, quantity: 2 }
  ]);
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule // Importar RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    //authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Otras pruebas aquí...
});
