import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../orders/services/cart.service';
import { WishlistService } from '../../../orders/services/wishlist.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';

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
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Main product arrays
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  // Layout options
  layoutView: 'grid' | 'list' = 'grid';
  isFilterOpen: boolean = false;
  itemsPerPage: number = 9;
  currentPage: number = 1;

  // Search and filters
  searchTerm: string = '';
  cartItemsCount: number = 0;
  private cartSubscription: Subscription | null = null;

  // Sample products data
  products: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      description: 'Latest M2 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      originalPrice: 2699.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Laptops',
      brand: 'Apple',
      rating: 4.8,
      inStock: true,
      isNew: true,
      specifications: [
        'M2 Pro chip',
        '16GB RAM',
        '512GB SSD',
        '16" Liquid Retina Display',
      ],
      tags: ['laptop', 'apple', 'macbook'],
    },
    {
      id: '2',
      name: 'Dell XPS 15',
      description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 4070',
      price: 1999.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Laptops',
      brand: 'Dell',
      rating: 4.6,
      inStock: true,
      specifications: ['Intel i9', '32GB RAM', '1TB SSD', 'RTX 4070'],
      tags: ['laptop', 'dell', 'xps'],
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5',
      description: 'Wireless Noise Cancelling Headphones',
      price: 399.99,
      originalPrice: 449.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Audio',
      brand: 'Sony',
      rating: 4.9,
      inStock: true,
      isFeatured: true,
      tags: ['headphones', 'wireless', 'audio'],
    },
    {
      id: '4',
      name: 'iPhone 15 Pro',
      description: 'A17 Pro chip, 256GB, Titanium finish',
      price: 1199.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Smartphones',
      brand: 'Apple',
      rating: 4.7,
      inStock: true,
      isNew: true,
      specifications: ['A17 Pro chip', '256GB storage', 'Triple camera system'],
      tags: ['smartphone', 'apple', 'iphone'],
    },
    {
      id: '5',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Snapdragon 8 Gen 3, 12GB RAM, 512GB storage',
      price: 1299.99,
      originalPrice: 1399.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Smartphones',
      brand: 'Samsung',
      rating: 4.6,
      inStock: true,
      specifications: [
        'Snapdragon 8 Gen 3',
        '12GB RAM',
        '512GB storage',
        '200MP camera',
      ],
      tags: ['smartphone', 'samsung', 'galaxy'],
    },
    {
      id: '6',
      name: 'Bose QuietComfort Ultra',
      description: 'Premium noise-cancelling headphones with spatial audio',
      price: 429.99,
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Audio',
      brand: 'Bose',
      rating: 4.7,
      inStock: true,
      specifications: [
        'Advanced noise cancellation',
        'Spatial audio',
        '24-hour battery life',
      ],
      tags: ['headphones', 'wireless', 'bose'],
    },
  ];

  sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  filters = {
    categories: ['Laptops', 'Smartphones', 'Audio', 'Gaming', 'Accessories'],
    brands: ['Apple', 'Samsung', 'Sony', 'Dell', 'Bose'],
    priceRanges: [
      { label: 'Under $100', min: 0, max: 100 },
      { label: '$100 - $500', min: 100, max: 500 },
      { label: '$500 - $1000', min: 500, max: 1000 },
      { label: 'Over $1000', min: 1000, max: Infinity },
    ],
  };

  selectedSort = 'featured';
  selectedFilters = {
    categories: [] as string[],
    brands: [] as string[],
    priceRange: null as any,
  };

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize products
    this.allProducts = [...this.products];
    this.applyFilters();

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    this.toastService.success(`${product.name} added to cart`);
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    this.toastService.info(`${product.name} added to wishlist`);
  }

  quickView(product: Product) {
    // Implement quick view functionality
    console.log('Quick view:', product);
    // This would typically open a modal with product details
  }

  applyFilters() {
    // Start with all products
    let filtered = [...this.allProducts];

    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }

    // Apply category filter
    if (this.selectedFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedFilters.categories.includes(product.category)
      );
    }

    // Apply brand filter
    if (this.selectedFilters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedFilters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    if (this.selectedFilters.priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= this.selectedFilters.priceRange.min &&
          product.price <= this.selectedFilters.priceRange.max
      );
    }

    // Apply sorting
    this.sortProducts(this.selectedSort, filtered);

    // Store filtered products
    this.filteredProducts = filtered;

    // Reset pagination and update displayed products
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  sortProducts(option: string, productList?: Product[]) {
    const products = productList || this.filteredProducts;

    this.selectedSort = option;

    switch (option) {
      case 'featured':
        products.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    if (!productList) {
      this.filteredProducts = [...products];
      this.updateDisplayedProducts();
    }
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

  clearPriceRange() {
    this.selectedFilters.priceRange = null;
    this.applyFilters();
  }

  clearAllFilters() {
    this.selectedFilters.categories = [];
    this.selectedFilters.brands = [];
    this.selectedFilters.priceRange = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  hasActiveFilters(): any {
    return (
      this.selectedFilters.categories.length > 0 ||
      this.selectedFilters.brands.length > 0 ||
      this.selectedFilters.priceRange !== null ||
      (this.searchTerm && this.searchTerm.trim() !== '')
    );
  }

  getCategoryCount(category: string): number {
    return this.allProducts.filter((product) => product.category === category)
      .length;
  }

  getBrandCount(brand: string): number {
    return this.allProducts.filter((product) => product.brand === brand).length;
  }

  calculateDiscount(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  loadMoreProducts() {
    this.currentPage++;
    this.updateDisplayedProducts();
  }

  private updateDisplayedProducts() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
}
