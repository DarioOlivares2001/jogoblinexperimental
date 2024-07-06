import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

/**
 * Componente de login que maneja la autenticación de usuarios.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * Formulario de login.
   */
  loginForm: FormGroup;

  /**
   * Mensaje de error que se muestra cuando las credenciales son inválidas.
   */
  errorMessage: string | null = null;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear el formulario.
   * @param userService - Servicio de usuarios para validar credenciales.
   * @param router - Router para la navegación.
   * @param authService - Servicio de autenticación para manejar el estado de la sesión.
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Método de inicialización.
   */
  ngOnInit(): void {}

  /**
   * Maneja el envío del formulario de login.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (this.userService.validateUser(email, password)) {
        this.errorMessage = null;
        const user = this.userService.getUserByEmail(email);
        const username = user ? user.username : 'Regular User';
        if (email === 'admin@gmail.com') {
          this.authService.loginAsAdmin();
          this.router.navigate(['adminproductos-component']);
        } else {
          this.authService.loginAsUser(username);
          this.router.navigate(['inicio-component']);
        }
      } else {
        this.errorMessage = 'Correo electrónico o contraseña inválidos';
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  /**
   * Obtiene el control de correo electrónico del formulario.
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * Obtiene el control de contraseña del formulario.
   */
  get password() {
    return this.loginForm.get('password');
  }
}
