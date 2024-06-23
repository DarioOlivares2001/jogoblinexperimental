import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-passwordreset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  passwordResetForm!: FormGroup;
  emailSent = false;
  userNotFound = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.passwordResetForm.get('email');
  }

  onSubmit(): void {
    this.userNotFound = false;
    this.emailSent = false;

    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.value.email;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);

      if (user) {
        console.log(`Enviar email a ${email} con la contraseña ${user.password}`);
        this.emailSent = true;
      } else {
        this.userNotFound = true;
      }
    }
  }
}
