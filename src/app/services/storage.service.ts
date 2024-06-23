import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorageTest__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  getItem(key: string): any {
    if (this.isLocalStorageAvailable()) {
      return JSON.parse(localStorage.getItem(key) || '[]');
    }
    return [];
  }

  setItem(key: string, value: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getUsers(): any[] {
    return this.getItem('users');
  }

  validateUser(email: string, password: string): boolean {
    const users = this.getUsers();
    console.log('Usuarios registrados:', users);
    return users.some(user => user.email === email && user.password === password);
  }

  getUserByEmail(email: string): any {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }
}
