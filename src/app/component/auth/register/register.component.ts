import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registrationSuccess = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['']
    }, { validators: [this.passwordMatchValidator, this.ageValidator] });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password, birthdate, address } = this.registerForm.value;
      const user = {
        id: Date.now(),
        username,
        email,
        password,
        address,
        birthdate
      };

      this.userService.addUser(user);
      console.log('User registered successfully:', user);

      this.registrationSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/login-component']);
      }, 2000);
    } else {
      console.error('Formulario inválido');
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthdate = control.get('birthdate')?.value;
    if (!birthdate) {
      return null;
    }
    const age = this.calculateAge(new Date(birthdate));

    return age < 13 ? { ageRequirement: true } : null;
  }

  calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  resetForm() {
    this.registerForm.reset();
  }
}
