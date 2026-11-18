import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }

  syncProducts(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/products/sync`, {});
  }

  getImageUrl(imageUrl: string): string {
    return `${this.apiUrl}${imageUrl}`;
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/health`);
  }
}
