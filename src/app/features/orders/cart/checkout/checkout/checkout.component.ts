import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../../services/cart.service';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  cartItems: CartItem[] = [];
  isLoading = true;

  // Forms
  shippingForm: FormGroup;
  billingForm: FormGroup;

  // Checkout options
  shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivered within 5-7 business days',
      price: 500,
      estimatedDelivery: '5-7 business days',
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivered within 2-3 business days',
      price: 700,
      estimatedDelivery: '2-3 business days',
    },
    {
      id: 'next-day',
      name: 'Next Day Delivery',
      description: 'Order before 2pm for next day delivery',
      price: 1000,
      estimatedDelivery: 'Next business day',
    },
  ];

  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: 'far fa-credit-card',
    },
    { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
    { id: 'mpesa', name: 'M-Pesa', icon: 'fas fa-mobile-alt' },
  ];

  // Selected options
  selectedShippingMethod: string = 'standard';
  selectedPaymentMethod: string = 'credit-card';
  sameBillingAddress: boolean = true;

  // Order calculation
  tax: number = 0;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // Initialize forms
    this.shippingForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['Kenya', [Validators.required]],
    });

    this.billingForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['Kenya', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Get cart items
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.isLoading = false;

      // Calculate tax (assuming 16% VAT for Kenya)
      this.tax = this.getSubtotal() * 0.16;

      // Redirect if cart is empty
      if (!this.isLoading && this.cartItems.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  // Navigation methods
  nextStep(): void {
    if (this.currentStep === 1 && this.shippingForm.valid) {
      this.currentStep++;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 2) {
      this.currentStep++;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 3 && this.shouldAllowPayment()) {
      this.placeOrder();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  // Toggle billing address same as shipping
  toggleBillingAddress(): void {
    this.sameBillingAddress = !this.sameBillingAddress;

    if (this.sameBillingAddress) {
      // Copy shipping address to billing
      this.billingForm.setValue({
        firstName: this.shippingForm.get('firstName')!.value,
        lastName: this.shippingForm.get('lastName')!.value,
        address: this.shippingForm.get('address')!.value,
        city: this.shippingForm.get('city')!.value,
        state: this.shippingForm.get('state')!.value,
        zipCode: this.shippingForm.get('zipCode')!.value,
        country: this.shippingForm.get('country')!.value,
      });
    }
  }

  // Select shipping method
  selectShippingMethod(methodId: string): void {
    this.selectedShippingMethod = methodId;
  }

  // Select payment method
  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  // Check if payment should be allowed
  shouldAllowPayment(): boolean {
    if (this.sameBillingAddress) {
      return this.shippingForm.valid;
    } else {
      return this.shippingForm.valid && this.billingForm.valid;
    }
  }

  // Place order method
  placeOrder(): void {
    // Here you would typically send order data to your backend
    console.log('Order placed');
    console.log('Shipping details:', this.shippingForm.value);
    console.log(
      'Billing details:',
      this.sameBillingAddress ? this.shippingForm.value : this.billingForm.value
    );
    console.log('Shipping method:', this.selectedShippingMethod);
    console.log('Payment method:', this.selectedPaymentMethod);
    console.log('Order items:', this.cartItems);
    console.log('Order total:', this.getTotal());

    // Simulate successful order
    this.currentStep = 4;

    // Clear cart after successful order
    // this.cartService.clearCart();

    // In a real app, you would only clear cart after successful payment/order confirmation
  }

  // Get selected shipping method object
  getSelectedShippingMethod(): ShippingMethod {
    return this.shippingMethods.find(
      (method) => method.id === this.selectedShippingMethod
    )!;
  }

  // Get selected payment method object
  getSelectedPaymentMethod(): PaymentMethod {
    return this.paymentMethods.find(
      (method) => method.id === this.selectedPaymentMethod
    )!;
  }

  // Order calculation methods
  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + this.getItemSubtotal(item),
      0
    );
  }

  getShippingCost(): number {
    return this.getSelectedShippingMethod().price;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.tax;
  }

  // Format price as currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  }

  // Generate random order ID for demo purposes
  getOrderId(): string {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  }

  // Return to store
  returnToStore(): void {
    this.router.navigate(['/products']);
  }
}
