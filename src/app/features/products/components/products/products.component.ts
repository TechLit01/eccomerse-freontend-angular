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
      name: 'Backlit Panel"',
      description: '40 watts, 100lm/w ',
      price: 2499.99,
      originalPrice: 2699.99,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637120/led-panel-lights-600x600-1_zjzxdq.webp',
      category: 'Backlit Panels',
      brand: ' QLA',
      rating: 4.8,
      inStock: true,
      isNew: true,
      specifications: ['3000K', '4000K', '6000K', 'CCT'],
      tags: ['downlighters', 'alu profiles', 'striplights']
    },
    {
      id: '2',
      name: 'Aluminium Profile',
      description: '10*10 Aluminium Profile',
      price: 400,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637249/alu17_aluminium_led_profile_with_warm_white_led_strip_dyt7r3.webp',
      category: 'Aluminium Profiles',
      brand: 'QLA',
      rating: 4.6,
      inStock: true,
      specifications: ['10*10', 'recessed', '2meters', 'aluminium'],
      tags: ['Alu profiles', 'Baclit Panels', 'Striplights']
    },
    {
      id: '3',
      name: 'Downlighters',
      description: '9W Downlight',
      price: 399,
      originalPrice: 449,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      category: 'Downlighters',
      brand: 'QLA',
      rating: 4.9,
      inStock: true,
      specifications: ['square', 'round', 'daylight', 'warmwhite'],
      isFeatured: true,
      tags: ['Downlighters', 'Alu Profiles', 'Backlit Panels']
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
    categories: ['Backlit Panels', 'Aluminium Profiles', 'Downlighters', 'Panel Lights', 'Switches'],
    brands: ['QLA', 'Philips', 'Osram', 'Ledvance', ],
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