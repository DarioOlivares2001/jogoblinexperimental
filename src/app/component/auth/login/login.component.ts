import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

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

  ngOnInit(): void {}

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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
