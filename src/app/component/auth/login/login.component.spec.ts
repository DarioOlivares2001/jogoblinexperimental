import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

class MockAuthService {
  loginAsAdmin() {}
  loginAsUser(username: string) {}
}

class MockStorageService {
  validateUser(email: string, password: string) {
    return email === 'test@test.com' && password === 'password';
  }
  getUserByEmail(email: string) {
    return { username: 'Test User' };
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let storageService: MockStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Importar el componente standalone
        ReactiveFormsModule,
        RouterTestingModule,
        CommonModule,
        RouterLink
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: StorageService, useClass: MockStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    storageService = TestBed.inject(StorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Otras pruebas aquí...
});
