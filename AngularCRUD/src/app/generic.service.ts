import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post<number>(`${this.url}create`, body);  // Ruta explícita para crear usuario
  }
  update(body: T) {
    return this.http.put<void>(this.url, body);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}${id}`);
  }

  authenticate(username: string, password: string): Observable<User | null> {
    console.log("Enviando solicitud de autenticación:", { username, password });
    return this.http.post<User | null>(`${this.url}authenticate`, { username, password });
  }
}
