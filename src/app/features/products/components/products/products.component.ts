import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../orders/services/cart.service';
import { WishlistService } from '../../../orders/services/wishlist.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  specifications?: string[];
  tags?: string[];
}
@Component({
  selector: 'app-products',
  standalone: false,
  
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      description: 'Latest M2 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      originalPrice: 2699.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Laptops',
      brand: 'Apple',
      rating: 4.8,
      inStock: true,
      isNew: true,
      specifications: ['M2 Pro chip', '16GB RAM', '512GB SSD', '16" Liquid Retina Display'],
      tags: ['laptop', 'apple', 'macbook']
    },
    {
      id: '2',
      name: 'Dell XPS 15',
      description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 4070',
      price: 1999.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Laptops',
      brand: 'Dell',
      rating: 4.6,
      inStock: true,
      specifications: ['Intel i9', '32GB RAM', '1TB SSD', 'RTX 4070'],
      tags: ['laptop', 'dell', 'xps']
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5',
      description: 'Wireless Noise Cancelling Headphones',
      price: 399.99,
      originalPrice: 449.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Audio',
      brand: 'Sony',
      rating: 4.9,
      inStock: true,
      isFeatured: true,
      tags: ['headphones', 'wireless', 'audio']
    },
    // Add more dummy products...
  ];

   sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  filters = {
    categories: ['Laptops', 'Smartphones', 'Audio', 'Gaming', 'Accessories'],
    brands: ['Apple', 'Samsung', 'Sony', 'Dell', 'Bose'],
    priceRanges: [
      { label: 'Under $100', min: 0, max: 100 },
      { label: '$100 - $500', min: 100, max: 500 },
      { label: '$500 - $1000', min: 500, max: 1000 },
      { label: 'Over $1000', min: 1000, max: Infinity }
    ]
  };

  selectedSort = 'featured';
  selectedFilters = {
    categories: [] as string[],
    brands: [] as string[],
    priceRange: null as any
  };

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.applyFilters();
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    
    // Optional: You can add a notification toast here to inform the user
    this.showAddToCartNotification(product.name);
  }

  showAddToCartNotification(productName: string) {
    // This is a placeholder for a notification system
    // You might want to implement a toast notification service
    console.log(`${productName} added to cart`);
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  }

  applyFilters() {
    // Filter implementation would go here
    // For now, we're just using the dummy data
  }

  sortProducts(option: string) {
    this.selectedSort = option;
    // Sorting implementation would go here
  }

  toggleFilter(type: 'categories' | 'brands', value: string) {
    const index = this.selectedFilters[type].indexOf(value);
    if (index > -1) {
      this.selectedFilters[type].splice(index, 1);
    } else {
      this.selectedFilters[type].push(value);
    }
    this.applyFilters();
  }

  setPriceRange(range: any) {
    this.selectedFilters.priceRange = range;
    this.applyFilters();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}