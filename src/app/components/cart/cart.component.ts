import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../shared/services/cart.service';
import { ToastService } from '../../shared/toast/toast.service';
import { buildReceiptHtml, generateReceiptPdfDataUrl } from '../../shared/receipt/receipt.util';
import { ReceiptModalComponent } from '../../shared/receipt/receipt-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceiptModalComponent, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartCount$: Observable<number>;
  orders$: Observable<any[]>;
  isCartOpen = false;
  // Payment modal state
  isPayModalOpen = false;
  payTransactionId = '';
  payOrderId: string | null = null; // which order to attach payment to
  // inline receipt modal state
  showReceiptModal = false;
  receiptOrder: any = null;
  // delivery form state for cart checkout
  deliveryName = '';
  deliveryPhone = '';
  deliveryAddress = '';
  deliveryInstructions = '';
  deliveryCoords: { lat: number; lng: number } | null = null;
  // mobile orders toggle
  showOrdersMobile = false;

  constructor(private cartService: CartService, private toast: ToastService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartCount$ = this.cartService.cartCount$;
    this.orders$ = this.cartService.orders$;
    // subscribe to shared cart open state
    this.cartService.cartOpen$.subscribe(v => this.isCartOpen = v);
  }

  ngOnInit(): void {
    // ensure orders are loaded from localStorage on client after hydration
    try {
      this.cartService.loadOrders();
    } catch (e) {
      // ignore in SSR
    }
  }

  toggleCart(): void {
    this.cartService.toggleCartOpen();
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

  proceedToPayNow(): void {
    // Save the order first and prompt for immediate M-Pesa payment
    // Require delivery details
    if (!this.deliveryName || !this.deliveryPhone || !this.deliveryAddress) {
      try { this.toast.error('Please provide name, phone and delivery address before checkout.'); } catch (e) {}
      return;
    }

    const currentCartItems = this.cartService.getCartItemsSnapshot();
    const items = currentCartItems.map((i: CartItem) => ({ product: { ...i.product }, quantity: i.quantity }));
    const total = this.cartService.getCartTotal();

    const orderPayload = {
      items,
      total,
      delivery: {
        name: this.deliveryName,
        phone: this.deliveryPhone,
        address: this.deliveryAddress,
        coords: this.deliveryCoords || null,
        instructions: this.deliveryInstructions || null
      }
    };

    try {
      // Create order and immediately prompt for payment
      const order = this.cartService.saveOrder(orderPayload);
      
      // Open payment modal for immediate payment
      this.payOrderId = order.id;
      this.payTransactionId = '';
      this.isPayModalOpen = true;
      try { this.toast.success('Order created! Please complete M-Pesa payment.'); } catch (e) {}
    } catch (err) {
      console.error('Order creation failed', err);
      try { this.toast.error('Order creation failed. Please try again.'); } catch (e) {}
    }
  }

  proceedToWhatsApp(): void {
    // Save the order first so the user has an order record (receipt) to attach payment to later.
    // Require delivery details
    if (!this.deliveryName || !this.deliveryPhone || !this.deliveryAddress) {
      try { this.toast.error('Please provide name, phone and delivery address before checkout.'); } catch (e) {}
      return;
    }

    const details = {
      name: this.deliveryName,
      phone: this.deliveryPhone,
      address: this.deliveryAddress,
      coords: this.deliveryCoords || null,
      instructions: this.deliveryInstructions || null
    };

    this.cartService.checkoutViaWhatsApp(details).then(message => {
      const phoneNumber = '254713209541';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      this.isCartOpen = false;
      try { this.toast.success('Order placed and WhatsApp opened.'); } catch (e) {}
    }).catch(err => {
      console.error('Checkout failed', err);
      try { this.toast.error('Checkout failed. Please try again.'); } catch (e) {}
    });
  }

  pinMyLocation(): void {
    if (!navigator.geolocation) {
      try { this.toast.error('Geolocation is not supported by your browser'); } catch (e) {}
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.deliveryCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try { this.toast.success('Location pinned.'); } catch (e) {}
      },
      (err) => {
        console.error('Geolocation error', err);
        try { this.toast.error('Unable to retrieve your location. Please enable location services.'); } catch (e) {}
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  openPayModal(orderId?: string): void {
    // if not provided, default to most recent order
    this.payOrderId = orderId || (this.cartService.getOrdersSnapshot()[0]?.id ?? null);
    this.payTransactionId = '';
    this.isPayModalOpen = true;
  }

  confirmPayment(): void {
    if (!this.payOrderId || !this.payTransactionId) return;
    const updated = this.cartService.attachPaymentToOrder(this.payOrderId, { method: 'M-PESA', providerNumber: '0713209541', transactionId: this.payTransactionId });
    if (updated) {
      // show toast confirmation and open printable receipt
      try { this.toast.success(`Payment confirmed! Order ${updated.id} is now complete.`); } catch (e) {}
      this.isPayModalOpen = false;
      // Clear the cart after successful payment
      this.cartService.clearCart();
      // show inline receipt modal
      this.receiptOrder = updated;
      this.showReceiptModal = true;
    } else {
      try { this.toast.error('Failed to confirm payment. Please try again.'); } catch (e) {}
    }
  }

  // Re-add an order's items to the cart for re-ordering
  reorder(orderId: string): void {
    const order = this.cartService.getOrdersSnapshot().find(o => o.id === orderId);
    if (!order) return;
    order.items.forEach(item => {
      this.cartService.addToCart(item.product, item.quantity);
    });
    try { this.toast.success(`Added ${order.items.length} items from order ${order.id} to your cart.`); } catch (e) {}
  }

  closeReceiptModal(): void {
    this.showReceiptModal = false;
    this.receiptOrder = null;
  }

  formatPrice(price: { min: number, max: number }): string {
    const avgPrice = (price.min + price.max) / 2;
    return `KES ${avgPrice.toLocaleString()}`;
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
}