import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {
  url: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<T[]>(`${this.url}user/`);
  }

  getById(id: number) {
    return this.http.get<T>(`${this.url}user/${id}`);
  }

  create(body: T) {
    return this.http.post<number>(`${this.url}user/create`, body);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.url}user/${user.id}`, user);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}user/${id}`);
  }

  authenticate(username: string, password: string): Observable<User | null> {
    return this.http.post<User | null>(`${this.url}user/authenticate`, { username, password }, {
      withCredentials: true // Asegúrate de incluir las credenciales
    });
  }

  getUserBySession(): Observable<User | null> {
    return this.http.get<User | null>(`${this.url}user/session`, {
      withCredentials: true // Asegúrate de incluir las credenciales
    });
  }

  saveBudget(budget: any): Observable<any> {
    return this.http.post<any>(`${this.url}budget/save`, budget);
  }

  checkBudgetForMonth(userId: string, year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.url}budget/check/${userId}/${year}/${month}`);
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post<any>(`${this.url}expense/create`, expense);
  }
}
