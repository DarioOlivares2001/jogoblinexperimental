import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private apiUrl = 'https://api-jogo-alpha.vercel.app/users'; // URL de la API desplegada en Vercel
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers() {
    this.http.get<User[]>(this.apiUrl).subscribe(data => {
      this.users = data;
      this.usersSubject.next(this.users);
    });
  }

  private saveUsers() {
    this.http.post(this.apiUrl, this.users, this.httpOptions).subscribe(
      response => {
        console.log('Usuarios guardados con éxito', response);
      },
      error => {
        console.error('Error al guardar usuarios', error);
      }
    );
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User) {
    user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    this.users.push(user);
    this.saveUsers();
    this.usersSubject.next(this.users);
  }

  updateUser(index: number, user: User) {
    this.users[index] = user;
    this.saveUsers();
    this.usersSubject.next(this.users);
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.saveUsers();
    this.usersSubject.next(this.users);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  validateUser(email: string, password: string): boolean {
    const user = this.users.find(user => user.email === email && user.password === password);
    return !!user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}
