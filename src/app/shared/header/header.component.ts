import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  cartCount$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  isCartOpen = false;

  constructor(public authService: AuthService, private cartService: CartService) {
    this.cartCount$ = this.cartService.cartCount$;
    this.cartItems$ = this.cartService.cartItems$;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.closeCart();
  }

  proceedToWhatsApp(): void {
    const message = this.cartService.generateWhatsAppMessage();
    const phoneNumber = '254713209541';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    this.closeCart();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();  // Assuming your AuthService has this method
  }
}
