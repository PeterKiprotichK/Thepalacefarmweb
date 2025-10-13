import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    min: number;
    max: number;
  };
  image?: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  delivery?: { name?: string; phone?: string; address?: string; coords?: { lat: number; lng: number } | null; instructions?: string | null };
  payment?: { method: string; providerNumber?: string; transactionId?: string; paidAt?: string };
  createdAt: string; // ISO string
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  private cartCount = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCount.asObservable();

  // Sample products based on your data
  products: Product[] = [
    {
      id: '1',
      name: 'Improved Kienyeji Chicks',
      description: 'Well vaccinated improved Kienyeji chicks',
      price: { min: 300, max: 350 },
      category: 'Poultry',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249716/WhatsApp_Image_2025-05-26_at_11.28.52_b0c2adae_o5d9b2.jpg'
    },
    {
      id: '2',
      name: 'Multistorey Gardens',
      description: 'Make your farm modern with our multistorey garden systems',
      price: { min: 1500, max: 2000 },
      category: 'Garden Systems',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249718/WhatsApp_Image_2025-05-26_at_11.28.36_a950ebb3_cgtqke.jpg'
    },
    {
      id: '3',
      name: 'BSF (Black Soldier Fly) Training',
      description: 'Training on production of black soldier fly',
      price: { min: 1500, max: 2000 },
      category: 'Training',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249718/WhatsApp_Image_2025-05-26_at_11.28.30_14c33672_aibavq.jpg'
    }
  ];

  constructor() {
    this.updateCartCount();
    this.loadOrdersFromStorage();
  }

  /**
   * Public method to explicitly load orders (useful to call on client after hydration)
   */
  public loadOrders(): void {
    this.loadOrdersFromStorage();
  }

  /**
   * Return a snapshot of saved orders (not observable)
   */
  public getOrdersSnapshot(): Order[] {
    return this.orders.value;
  }

  /**
   * Attach payment details to an existing order by id; persists and returns updated order
   */
  attachPaymentToOrder(orderId: string, payment: { method: string; providerNumber?: string; transactionId?: string }): Order | null {
    const idx = this.orders.value.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const updated: Order = {
      ...this.orders.value[idx],
      payment: {
        method: payment.method,
        providerNumber: payment.providerNumber,
        transactionId: payment.transactionId,
        paidAt: new Date().toISOString()
      }
    };

    const list = [...this.orders.value];
    list[idx] = updated;
    this.orders.next(list);
    this.persistOrders();
    return updated;
  }

  /**
   * Attach a PDF receipt data URL (data:application/pdf;...) to an existing order and persist.
   */
  attachReceiptToOrder(orderId: string, receiptDataUrl: string): Order | null {
    const idx = this.orders.value.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const updated: Order = {
      ...this.orders.value[idx],
      // store under a top-level receipt field to avoid interfering with payment structure
      // note: storing base64 data in localStorage may increase storage size
      // but this keeps the receipt attached to the order for later retrieval/download
      receipt: receiptDataUrl
    } as any;

    const list = [...this.orders.value];
    list[idx] = updated;
    this.orders.next(list);
    this.persistOrders();
    return updated;
  }

  // Orders management
  private orders = new BehaviorSubject<Order[]>([]);
  public orders$ = this.orders.asObservable();

  private loadOrdersFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) {
        // running on server (SSR) or localStorage not available
        return;
      }
      const raw = window.localStorage.getItem('palace_orders');
      if (raw) {
        this.orders.next(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load orders from storage', e);
    }
  }

  private persistOrders(): void {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) return;
      window.localStorage.setItem('palace_orders', JSON.stringify(this.orders.value));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }

  saveOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
      ...order
    };
    const list = [newOrder, ...this.orders.value];
    this.orders.next(list);
    this.persistOrders();
    return newOrder;
  }

  placeOrder(details: { name?: string; phone?: string; address?: string; coords?: { lat: number; lng: number } | null; instructions?: string | null } = {}): string {
    const items = this.cartItems.value.map(i => ({ product: { ...i.product }, quantity: i.quantity }));
    const total = this.getCartTotal();

    const orderPayload: Omit<Order, 'id' | 'createdAt'> = {
      items,
      total,
      delivery: {
        name: details.name,
        phone: details.phone,
        address: details.address,
        coords: details.coords || null,
        instructions: details.instructions || null
      }
    };

    const saved = this.saveOrder(orderPayload);

    // Build WhatsApp message based on current cart contents and provided delivery details
    const message = this.generateWhatsAppMessageWithDelivery(orderPayload.delivery || {});

    // Optionally clear the cart after placing order
    this.clearCart();

    // Return the encoded WhatsApp message for the order
    return message;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.next([...currentItems]);
    this.updateCartCount();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedItems);
    this.updateCartCount();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.updateCartCount();
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.updateCartCount();
  }

  private updateCartCount(): void {
    const total = this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
    this.cartCount.next(total);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      const avgPrice = (item.product.price.min + item.product.price.max) / 2;
      return total + (avgPrice * item.quantity);
    }, 0);
  }

  generateWhatsAppMessage(): string {
    const items = this.cartItems.value;
    const total = this.getCartTotal();
    
    let message = `🛒 *Order from The Palace Farm*\n\n`;
    
    items.forEach(item => {
      const avgPrice = (item.product.price.min + item.product.price.max) / 2;
      message += `📦 *${item.product.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: KES ${avgPrice.toLocaleString()}\n`;
      message += `   Subtotal: KES ${(avgPrice * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `💰 *Total: KES ${total.toLocaleString()}*\n\n`;
    message += `Please confirm this order and provide delivery details. Thank you!`;
    
    return encodeURIComponent(message);
  }

  /**
   * Build a WhatsApp message including customer/delivery details and return encoded string
   */
  generateWhatsAppMessageWithDelivery(details: { name?: string; phone?: string; address?: string; coords?: { lat: number; lng: number } | null; instructions?: string | null }): string {
    const items = this.cartItems.value;
    const total = this.getCartTotal();

    let message = `🛒 *Order from The Palace Farm*\n\n`;

    items.forEach(item => {
      const avgPrice = (item.product.price.min + item.product.price.max) / 2;
      message += `📦 *${item.product.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: KES ${avgPrice.toLocaleString()}\n`;
      message += `   Subtotal: KES ${(avgPrice * item.quantity).toLocaleString()}\n\n`;
    });

    message += `💰 *Total: KES ${total.toLocaleString()}*\n\n`;

    message += `*Delivery Details*\n`;
    if (details.name) message += `Name: ${details.name}\n`;
    if (details.phone) message += `Phone: ${details.phone}\n`;
    if (details.address) message += `Address: ${details.address}\n`;
    if (details.coords) message += `Location: https://www.google.com/maps?q=${details.coords.lat},${details.coords.lng}\n`;
    if (details.instructions) message += `Instructions: ${details.instructions}\n`;

    message += `\nPlease confirm this order and provide any additional delivery instructions. Thank you!`;

    return encodeURIComponent(message);
  }
}