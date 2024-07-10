import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private apiUrl = 'https://api-jogo-qucx.onrender.com'; // URL de la API desplegada en Render
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
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe(data => {
      this.users = data;
      this.usersSubject.next(this.users);
    });
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User) {
    this.http.post<User>(`${this.apiUrl}/users`, user, this.httpOptions).subscribe({
      next: (response) => {
        this.users.push(response);
        this.usersSubject.next(this.users);
        console.log('Usuario agregado con éxito');
      },
      error: (error) => {
        console.error('Error al agregar usuario', error);
      }
    });
  }

  updateUser(user: User) {
    this.http.put(`${this.apiUrl}/users/${user.id}`, user, this.httpOptions).subscribe({
      next: () => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
          this.usersSubject.next(this.users);
        }
        console.log('Usuario actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar usuario', error);
      }
    });
  }

  deleteUser(userId: number) {
    const url = `${this.apiUrl}/users/${userId}`;
    this.http.delete(url, this.httpOptions).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.usersSubject.next(this.users);
        console.log('Usuario eliminado con éxito');
      },
      error: (error) => {
        console.error('Error al eliminar el usuario', error);
      }
    });
  }

  getUserByUsername(username: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => users.find(user => user.username === username))
    );
  }

  validateUser(email: string, password: string): boolean {
    const user = this.users.find(user => user.email === email && user.password === password);
    return !!user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}
