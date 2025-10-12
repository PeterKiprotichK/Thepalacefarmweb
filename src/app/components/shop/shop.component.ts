import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../shared/services/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.products = this.cartService.products;
    this.categories = ['All', ...new Set(this.products.map(p => p.category))];
  }

  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'All') {
      return this.products;
    }
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  formatPrice(price: { min: number; max: number }): string {
    if (price.min === price.max) {
      return `KES ${price.min.toLocaleString()}`;
    }
    return `KES ${price.min.toLocaleString()} - ${price.max.toLocaleString()}`;
  }
}