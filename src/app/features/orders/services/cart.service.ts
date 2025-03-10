import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    // Load cart items from session storage on service initialization
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const storedItems = sessionStorage.getItem(this.STORAGE_KEY);
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems);
        this.cartItems.next(items);
      } catch (error) {
        console.error('Error parsing cart data from session storage:', error);
        this.cartItems.next([]);
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(i => i.id === item.id);

    let updatedItems: CartItem[];

    if (existingItem) {
      // Update quantity if item already exists
      updatedItems = currentItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      // Add new item
      updatedItems = [...currentItems, item];
    }

    // Update BehaviorSubject and session storage
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  removeFromCart(itemId: string) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    
    // Update BehaviorSubject and session storage
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = this.cartItems.getValue();
    
    // Remove item if quantity is 0 or less
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    
    const updatedItems = currentItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    // Update BehaviorSubject and session storage
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart() {
    this.cartItems.next([]);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  getCartTotal(): number {
    return this.cartItems.getValue().reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  }

  getCartItemsCount(): number {
    return this.cartItems.getValue().reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
}