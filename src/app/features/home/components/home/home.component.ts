import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '../../../orders/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
interface Category {
  name: string;
  slug: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Original data
  categories: Category[] = [
    {
      name: 'Backlit Panels',
      slug: 'backlit-panels',
      icon: 'fas fa-laptop',
    },
    {
      name: 'Downlights',
      slug: 'downlights',
      icon: 'fas fa-mobile-alt',
    },
    {
      name: 'Switches',
      slug: 'switches',
      icon: 'fas fa-tablet-alt',
    },
    {
      name: 'RGB Strips',
      slug: 'rgb-strips',
      icon: 'fas fa-camera',
    },
    {
      name: 'Strip Lights',
      slug: 'strip-lights',
      icon: 'fas fa-headphones',
    },
    {
      name: 'Digital RGB Strips',
      slug: 'digital-rgb-strips',
      icon: 'fas fa-plug',
    },
  ];

  featuredProducts: Product[] = [
    {
      id: '1',
      name: ' Backlit Panel"',
      description: '40w,100lm/watt',
      price: 2499,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637120/led-panel-lights-600x600-1_zjzxdq.webp',
      category: 'backlit-panels',
    },
    {
      id: '2',
      name: 'Strip Lights',
      description: '24V 3000K COB Striplight',
      price: 1800,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637455/cob-led-strip-480-ledm-12v-ip20-118wm_omdvhy.jpg',
      category: 'strip-lights',
    },
    {
      id: '3',
      name: 'Downlighters',
      description: '12W Downlight',
      price: 495,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      category: 'downlighters',
    },
    {
      id: '4',
      name: 'Aluminium Profiles',
      description: '10*10mm Aluminium Profile',
      price: 400,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637249/alu17_aluminium_led_profile_with_warm_white_led_strip_dyt7r3.webp',
      category: 'aluminium-profiles',
    },
  ];

  // Filtering and sorting properties
  filteredProducts: Product[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  sortOption: string = 'price-low';

  // Cart related properties
  cartItemsCount: number = 0;
  private cartSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize filtered products
    this.filteredProducts = [...this.featuredProducts];

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from cart changes to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Filter products based on category and search term
  filterProducts() {
    let filtered = [...this.featuredProducts];

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    // Filter by search term
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
    this.sortProducts();
  }

  // Sort products based on selected sort option
  sortProducts() {
    switch (this.sortOption) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }

  // Reset filters
  resetFilters() {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.sortOption = 'price-low';
    this.filterProducts();
  }

  // Get category name from slug
  getCategoryName(slug: string): string {
    const category = this.categories.find((c) => c.slug === slug);
    return category ? category.name : slug;
  }

  // Cart related methods
  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    // Show toast notification
    this.showAddToCartNotification(product.name);
  }

  addToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
    // Implement wishlist functionality
  }

  // Show a temporary notification when a product is added to cart
  private showAddToCartNotification(productName: string) {
    this.toastService.success(`${productName} added to cart!`);
  }
}
