import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(this.getFromLocalStorage('isAdmin') === 'true');
  isAdmin$ = this.isAdminSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getFromLocalStorage('isLoggedIn') === 'true');
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(this.getFromLocalStorage('username'));
  username$ = this.usernameSubject.asObservable();

  constructor(private router: Router) {}

  loginAsAdmin() {
    this.isAdminSubject.next(true);
    this.isLoggedInSubject.next(true);
    this.setToLocalStorage('isAdmin', 'true');
    this.setToLocalStorage('isLoggedIn', 'true');
    this.setToLocalStorage('username', 'Admin User'); // Guarda el nombre del usuario
    this.usernameSubject.next('Admin User');
    this.router.navigate(['adminproductos-component']);
  }

  loginAsUser(username: string) {
    this.isAdminSubject.next(false);
    this.isLoggedInSubject.next(true);
    this.setToLocalStorage('isAdmin', 'false');
    this.setToLocalStorage('isLoggedIn', 'true');
    this.setToLocalStorage('username', username);
    this.usernameSubject.next(username);
  }

  logout() {
    this.isAdminSubject.next(false);
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
    this.removeFromLocalStorage('isAdmin');
    this.removeFromLocalStorage('isLoggedIn');
    this.removeFromLocalStorage('username');
    this.router.navigate(['inicio-component']);
  }

  isAdmin() {
    return this.isAdminSubject.value;
  }

  isLoggedIn() {
    return this.isLoggedInSubject.value;
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  private getFromLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setToLocalStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeFromLocalStorage(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
