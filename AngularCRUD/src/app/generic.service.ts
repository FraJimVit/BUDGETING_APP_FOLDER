import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  url = 'https://localhost:7221/';

  constructor(private http:HttpClient) { }

  get() { return this.http.get<T[]>(this.url); }
  getById(id: number) { return this.http.get<T>(`${this.url}${id}`); }
  
  create(body: T) { return this.http.post<number>(this.url, body); }
  update(body: T) { return this.http.put<void>(this.url, body); }
  delete(id: number) { return this.http.delete<void>(`${this.url}${id}`); }
}
