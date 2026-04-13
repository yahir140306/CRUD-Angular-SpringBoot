import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = "http://localhost:8080/api/products";

  constructor(private http: HttpClient) {}

  view(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Product): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}
