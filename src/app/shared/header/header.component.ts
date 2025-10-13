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
    const details = {
      name: this.deliveryName,
      phone: this.deliveryPhone,
      address: this.deliveryAddress,
      coords: this.deliveryCoords || null,
      instructions: this.deliveryInstructions || null
    };
    // placeOrder will save the order into localStorage and clear the cart
    const message = this.cartService.placeOrder(details);
    // find the saved order (most recent)
    const saved = this.cartService.getOrdersSnapshot()[0];

    // generate receipt PDF and attach to order before redirecting
    if (saved && typeof window !== 'undefined') {
      generateReceiptPdfDataUrl(saved).then(dataUrl => {
        try { this.cartService.attachReceiptToOrder(saved.id, dataUrl); } catch (e) {}
        const phoneNumber = '254713209541';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        this.closeCart();
      }).catch(err => {
        console.error('Failed to generate receipt PDF', err);
        // still open WhatsApp but inform user
        try { this.toast.error('Failed to generate receipt PDF. Proceeding to WhatsApp.'); } catch (e) {}
        const phoneNumber = '254713209541';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        this.closeCart();
      });
    } else {
      const phoneNumber = '254713209541';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      this.closeCart();
    }
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
