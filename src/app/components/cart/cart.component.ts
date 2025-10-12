import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../shared/services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartCount$: Observable<number>;
  isCartOpen = false;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartCount$ = this.cartService.cartCount$;
  }

  ngOnInit(): void {}

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToWhatsApp(): void {
    const message = this.cartService.generateWhatsAppMessage();
    const phoneNumber = '254713209541';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    this.isCartOpen = false;
  }

  formatPrice(price: { min: number, max: number }): string {
    const avgPrice = (price.min + price.max) / 2;
    return `KES ${avgPrice.toLocaleString()}`;
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
}