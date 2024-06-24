import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../../../services/user.service';
import { of } from 'rxjs';


class MockUserService {
  addUser(user: any) {
    return of(user);
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegisterComponent],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 6 controls', () => {
    expect(component.registerForm.contains('username')).toBeTruthy();
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('confirmPassword')).toBeTruthy();
    expect(component.registerForm.contains('birthdate')).toBeTruthy();
    expect(component.registerForm.contains('address')).toBeTruthy();
  });

  it('should make the username control required', () => {
    const control = component.registerForm.get('username');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should validate the email control', () => {
    const control = component.registerForm.get('email');
    control?.setValue('notanemail');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should validate password and confirmPassword matching', () => {
    const control = component.registerForm;
    control.get('password')?.setValue('Password1');
    control.get('confirmPassword')?.setValue('Password2');
    expect(control.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should validate age requirement', () => {
    const control = component.registerForm;
    control.get('birthdate')?.setValue('2015-01-01');
    expect(control.hasError('ageRequirement')).toBeTruthy();
  });

  it('should call userService.addUser when form is valid', () => {
    spyOn(userService, 'addUser').and.callThrough();
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthdate: '2000-01-01',
      address: ''
    });
    component.onSubmit();
    expect(userService.addUser).toHaveBeenCalled();
  });

  it('should not call userService.addUser when form is invalid', () => {
    spyOn(userService, 'addUser').and.callThrough();
    component.registerForm.setValue({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      address: ''
    });
    component.onSubmit();
    expect(userService.addUser).not.toHaveBeenCalled();
  });
});
