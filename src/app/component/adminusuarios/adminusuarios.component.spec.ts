import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminusuariosComponent } from './adminusuarios.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock UserService
class MockUserService {
  private users = [
    { id: 1, username: 'User1', email: 'user1@example.com', password: 'password1', birthdate: '2000-01-01', address: 'Address 1' },
    { id: 2, username: 'User2', email: 'user2@example.com', password: 'password2', birthdate: '2001-02-02', address: 'Address 2' }
  ];

  users$ = of(this.users);

  getUsers() {
    return this.users;
  }

  addUser(user: any) {
    this.users.push(user);
  }

  updateUser(index: number, user: any) {
    this.users[index] = user;
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
  }
}

describe('AdminusuariosComponent', () => {
  let component: AdminusuariosComponent;
  let fixture: ComponentFixture<AdminusuariosComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AdminusuariosComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminusuariosComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users on ngOnInit', () => {
    component.ngOnInit();
    expect(component.users.length).toBe(2);
  });

  it('should reset form and variables on newUser', () => {
    component.newUser();
    expect(component.isEdit).toBeFalse();
    expect(component.userForm.valid).toBeFalse();
  });

  it('should populate form on editUser', () => {
    component.editUser(0);
    expect(component.isEdit).toBeTrue();
    expect(component.userForm.value.username).toBe('User1');
    expect(component.userForm.value.email).toBe('user1@example.com');
  });

  it('should call deleteUser on UserService when deleteUser is called', () => {
    spyOn(userService, 'deleteUser').and.callThrough();
    component.deleteUser(0);
    expect(userService.deleteUser).toHaveBeenCalledWith(0);
    expect(component.users.length).toBe(1);
  });

  it('should call addUser on UserService when saveUser is called for a new user', () => {
    spyOn(userService, 'addUser').and.callThrough();
    component.userForm.setValue({
      username: 'NewUser',
      email: 'newuser@example.com',
      password: 'newpassword',
      birthdate: '1999-01-01',
      address: 'New Address'
    });
    component.saveUser();
    expect(userService.addUser).toHaveBeenCalled();
    expect(component.users.length).toBe(3);
  });

  it('should call updateUser on UserService when saveUser is called for an existing user', () => {
    spyOn(userService, 'updateUser').and.callThrough();
    component.editUser(0);
    component.userForm.setValue({
      username: 'UpdatedUser',
      email: 'updateduser@example.com',
      password: 'updatedpassword',
      birthdate: '2000-01-01',
      address: 'Updated Address'
    });
    component.saveUser();
    expect(userService.updateUser).toHaveBeenCalledWith(0, jasmine.objectContaining({ username: 'UpdatedUser', email: 'updateduser@example.com' }));
    expect(component.users[0].username).toBe('UpdatedUser');
  });

  it('should set selectedUser on viewUser', () => {
    const user = { id: 1, username: 'User1', email: 'user1@example.com', password: 'password1', birthdate: '2000-01-01', address: 'Address 1' };
    component.viewUser(user);
    expect(component.selectedUser).toBe(user);
  });
});
