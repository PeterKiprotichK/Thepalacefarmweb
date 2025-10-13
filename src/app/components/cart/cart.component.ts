import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../shared/services/cart.service';
import { ToastService } from '../../shared/toast/toast.service';
import { buildReceiptHtml, generateReceiptPdfDataUrl } from '../../shared/receipt/receipt.util';
import { ReceiptModalComponent } from '../../shared/receipt/receipt-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceiptModalComponent],
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

  constructor(private cartService: CartService, private toast: ToastService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartCount$ = this.cartService.cartCount$;
    this.orders$ = this.cartService.orders$;
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
    // Save the order first so the user has an order record (receipt) to attach payment to later.
    try {
      const message = this.cartService.placeOrder();
      const saved = this.cartService.getOrdersSnapshot()[0];

      if (saved) {
        generateReceiptPdfDataUrl(saved).then(dataUrl => {
          try { this.cartService.attachReceiptToOrder(saved.id, dataUrl); } catch (e) {}
          const phoneNumber = '254713209541';
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
          window.open(whatsappUrl, '_blank');
          this.isCartOpen = false;
          try { this.toast.success('Order placed and receipt generated. WhatsApp opened.'); } catch (e) {}
        }).catch(err => {
          console.error('Failed to generate receipt PDF', err);
          const phoneNumber = '254713209541';
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
          window.open(whatsappUrl, '_blank');
          this.isCartOpen = false;
          try { this.toast.error('Order placed but failed to generate PDF. Proceeding to WhatsApp.'); } catch (e) {}
        });
      } else {
        const phoneNumber = '254713209541';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        this.isCartOpen = false;
        try { this.toast.success('Order placed. WhatsApp opened.'); } catch (e) {}
      }
    } catch (e) {
      try { this.toast.error('Failed to place order. Please try again.'); } catch (er) {}
    }
  }

  openPayModal(orderId?: string): void {
    // if not provided, default to most recent order
    this.payOrderId = orderId || (this.cartService.getOrdersSnapshot()[0]?.id ?? null);
    this.payTransactionId = '';
    this.isPayModalOpen = true;
  }

  confirmPayment(): void {
    if (!this.payOrderId || !this.payTransactionId) return;
    const updated = this.cartService.attachPaymentToOrder(this.payOrderId, { method: 'M-PESA', providerNumber: '0769920741', transactionId: this.payTransactionId });
    if (updated) {
      // show toast confirmation and open printable receipt
      try { this.toast.success(`Payment received for order ${updated.id}.`); } catch (e) {}
      this.isPayModalOpen = false;
      // show inline receipt modal
      this.receiptOrder = updated;
      this.showReceiptModal = true;
    } else {
      try { this.toast.error('Failed to attach payment.'); } catch (e) {}
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