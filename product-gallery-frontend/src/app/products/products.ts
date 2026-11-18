import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, JsonPipe, AsyncPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  public productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  health$!: Observable<any>;

  products: Product[] = [];

  loading = false;
  syncing = false;
  errorMessage = '';
  backendHealth = '';

  ngOnInit(): void {
    this.loadProducts();
    this.checkHealth();
    this.health$ = this.productService.checkHealth();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load products';
        this.loading = false;
      },
    });
  }

  syncProducts(): void {
    this.syncing = true;

    this.productService.syncProducts().subscribe({
      next: (response) => {
        alert(`${response.saved} products saved successfully!`);

        this.loadProducts();
        this.syncing = false;
      },
      error: () => {
        this.errorMessage = 'Product synchronization failed';
        this.syncing = false;
      },
    });
  }

  getImageUrl(imageUrl: string): string {
    return this.productService.getImageUrl(imageUrl);
  }

  checkHealth() {
    this.productService.checkHealth().subscribe({
      next: (response) => {
        this.backendHealth = response.message;
      },
    });
  }
}
