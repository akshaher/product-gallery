import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Products } from './products/products';

@Component({
  imports: [RouterOutlet, Products],
  selector: 'app-root',
  styleUrl: './app.css',
  standalone: true,
  template: '<app-products/>',
})
export class App {
  protected readonly title = signal('product-gallery-frontend');
}
