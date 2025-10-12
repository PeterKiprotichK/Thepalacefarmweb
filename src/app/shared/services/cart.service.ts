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
}