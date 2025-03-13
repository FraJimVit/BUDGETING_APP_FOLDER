import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {
  url: string = 'http://localhost:5000/user/';  // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<T[]>(this.url);
  }

  getById(id: number) {
    return this.http.get<T>(`${this.url}${id}`);
  }

  create(body: T) {
    return this.http.post<number>(`${this.url}create`, body);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.url}${user.id}`, user);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}${id}`);
  }

  authenticate(username: string, password: string): Observable<User | null> {
    return this.http.post<User | null>(`${this.url}authenticate`, { username, password }, {
      withCredentials: true // Asegúrate de incluir las credenciales
    });
  }

  getUserBySession(): Observable<User | null> {
    return this.http.get<User | null>(`${this.url}session`, {
      withCredentials: true // Asegúrate de incluir las credenciales
    });
  }
}
