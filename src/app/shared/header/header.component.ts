import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../services/cart.service';
import { generateReceiptPdfDataUrl } from '../receipt/receipt.util';
import { Observable } from 'rxjs';
import { ToastService } from '../toast/toast.service';

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

  constructor(public authService: AuthService, private cartService: CartService, private toast: ToastService) {
    this.cartCount$ = this.cartService.cartCount$;
    this.cartItems$ = this.cartService.cartItems$;
    try { this.cartService.loadOrders(); } catch (e) {}
  }

  toggleCart(): void {
    // toggle the shared cart open state
    this.cartService.toggleCartOpen();
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
    // If header delivery fields aren't filled, open cart panel for user to enter details there
    if (!this.deliveryName || !this.deliveryPhone || !this.deliveryAddress) {
      try { this.toast.info('Please open the cart and enter delivery name, phone and address before checkout.'); } catch (e) {}
      this.cartService.setCartOpen(true);
      return;
    }

    const details = {
      name: this.deliveryName,
      phone: this.deliveryPhone,
      address: this.deliveryAddress,
      coords: this.deliveryCoords || null,
      instructions: this.deliveryInstructions || null
    };
    // centralized checkout flow: places order, generates & attaches receipt (if possible), then returns message
    this.cartService.checkoutViaWhatsApp(details).then(message => {
      const phoneNumber = '254713209541';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      this.closeCart();
    }).catch(err => {
      console.error('Checkout failed', err);
      try { this.toast.error('Checkout failed. Please try again.'); } catch (e) {}
    });
  }

  // Delivery form state (kept loose to avoid adding FormsModule reactive code)
  deliveryName = '';
  deliveryPhone = '';
  deliveryAddress = '';
  deliveryInstructions = '';
  deliveryCoords: { lat: number; lng: number } | null = null;

  pinMyLocation(): void {
    if (!navigator.geolocation) {
      this.toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.deliveryCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // optionally fill address field with google maps reverse geocoding later
      },
      (err) => {
        console.error('Geolocation error', err);
        this.toast.error('Unable to retrieve your location. Please ensure location services are enabled.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
