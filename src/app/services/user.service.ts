import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = this.loadUsersFromLocalStorage();
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  users$ = this.usersSubject.asObservable();

  constructor(private storageService: StorageService) {}

  private loadUsersFromLocalStorage(): User[] {
    return this.storageService.getItem('users') || [];
  }

  private saveUsersToLocalStorage() {
    this.storageService.setItem('users', this.users);
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User) {
    user.id = this.users.length + 1;
    this.users.push(user);
    this.saveUsersToLocalStorage();
    this.usersSubject.next(this.users);
  }

  updateUser(index: number, user: User) {
    this.users[index] = user;
    this.saveUsersToLocalStorage();
    this.usersSubject.next(this.users);
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.saveUsersToLocalStorage();
    this.usersSubject.next(this.users);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }
}
