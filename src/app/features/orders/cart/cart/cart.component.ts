import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;
  
  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.isLoading = false;
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    // Ensure quantity is at least 1
    const quantity = Math.max(1, newQuantity);
    this.cartService.updateQuantity(item.id, quantity);
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  incrementQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  continueToCheckout(): void {
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    // Navigate to products page
    this.router.navigate(['/products']);
  }

  // Calculate subtotal for an item
  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  // Calculate cart subtotal
  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + this.getItemSubtotal(item), 0);
  }

  // Format price as currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}