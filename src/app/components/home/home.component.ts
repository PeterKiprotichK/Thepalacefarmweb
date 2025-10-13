import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentImage: any;
  images: any;
  currentIndex: any;

  constructor(private cartService: CartService, private router: Router) {}

  // Add a product to the cart by product id (uses products list in CartService)
  addToCartById(id: string): void {
    const product = this.cartService.products.find(p => p.id === id);
    if (product) {
      this.cartService.addToCart(product, 1);
      // lightweight user feedback
      try { window.dispatchEvent(new CustomEvent('palace:added-to-cart', { detail: { productId: id } })); } catch (e) {}
    }
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  // placeholder kept for compatibility with other code
  initTestimonials() {
    // intentionally left blank
  }
}
