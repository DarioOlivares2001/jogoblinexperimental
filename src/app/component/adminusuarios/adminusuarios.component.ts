import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address?: string;
}

declare var bootstrap: any;

@Component({
  selector: 'app-adminusuarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adminusuarios.component.html',
  styleUrls: ['./adminusuarios.component.css']
})
export class AdminusuariosComponent implements OnInit {
  @ViewChild('userFormModal') userFormModal!: ElementRef;

  userForm: FormGroup;
  isEdit = false;
  currentIndex: number | null = null;
  selectedUser: User | null = null;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {
    this.users = this.userService.getUsers();
    this.userService.users$.subscribe(users => this.users = users);
  }

  newUser() {
    this.isEdit = false;
    this.userForm.reset();
  }

  editUser(index: number) {
    this.isEdit = true;
    this.currentIndex = index;
    const user = this.users[index];
    this.userForm.patchValue(user);
  }

  deleteUser(index: number) {
    this.userService.deleteUser(index);
  }

  saveUser() {
    const newUser: User = {
      id: this.isEdit && this.currentIndex !== null ? this.users[this.currentIndex].id : this.users.length + 1,
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      birthdate: this.userForm.value.birthdate,
      address: this.userForm.value.address
    };

    if (this.isEdit && this.currentIndex !== null) {
      this.userService.updateUser(this.currentIndex, newUser);
    } else {
      this.userService.addUser(newUser);
    }

    console.log('Nuevo usuario agregado:', newUser);

    this.userForm.reset();


    if (isPlatformBrowser(this.platformId) && this.userFormModal) {
      const modalInstance = bootstrap.Modal.getInstance(this.userFormModal.nativeElement);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        const newModalInstance = new bootstrap.Modal(this.userFormModal.nativeElement);
        newModalInstance.hide();
      }
    }
  }

  viewUser(user: User) {
    this.selectedUser = user;
  }
}
