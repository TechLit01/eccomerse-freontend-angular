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
      name: 'Laptops',
      slug: 'laptops',
      icon: 'fas fa-laptop',
    },
    {
      name: 'Smartphones',
      slug: 'smartphones',
      icon: 'fas fa-mobile-alt',
    },
    {
      name: 'Tablets',
      slug: 'tablets',
      icon: 'fas fa-tablet-alt',
    },
    {
      name: 'Cameras',
      slug: 'cameras',
      icon: 'fas fa-camera',
    },
    {
      name: 'Audio',
      slug: 'audio',
      icon: 'fas fa-headphones',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      icon: 'fas fa-plug',
    },
  ];

  featuredProducts: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      description: 'Latest M2 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'laptops',
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      description: 'A17 Pro chip, 256GB, Titanium finish',
      price: 1199.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'smartphones',
    },
    {
      id: '3',
      name: 'iPad Pro 12.9"',
      description: 'M2 chip, 128GB, Space Gray',
      price: 1099.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'tablets',
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5',
      description: 'Wireless Noise Cancelling Headphones',
      price: 399.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'audio',
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
