// cart.service.ts

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
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, item]);
    }
  }

  removeFromCart(itemId: string) {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter(item => item.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItems.next(updatedItems);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}
