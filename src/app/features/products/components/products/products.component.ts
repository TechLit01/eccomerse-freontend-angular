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
      name: 'Backlit Panels"',
      description: '40 watts, 100lm/w',
      price: 2499,
      originalPrice: 2699,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637120/led-panel-lights-600x600-1_zjzxdq.webp',
      category: 'Backlit-panels',
      brand: 'QLA',
      rating: 4.8,
      inStock: true,
      isNew: true,
      specifications: ['40 watts', '100lm/w', '28-42V', 'CE ROHS'],
      tags: ['RGBW', 'Downlighters', 'Alu Profiles'],
    },
    {
      id: '2',
      name: 'Downlighters',
      description: '12W Downlight',
      price: 495,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      category: 'downlighters',
      brand: 'QLA',
      rating: 4.6,
      inStock: true,
      specifications: ['Square', 'round', 'Daylight', 'Warm White'],
      tags: ['BacKlit Panel', 'Striplights', 'Switches'],
    },
    {
      id: '3',
      name: 'Aluminium Profiles',
      description: '10*10mm Aluminium Profiles',
      price: 400,
      originalPrice: 449,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637249/alu17_aluminium_led_profile_with_warm_white_led_strip_dyt7r3.webp',
      category: 'Aluminium-profiles',
      brand: 'QLA',
      rating: 4.9,
      inStock: true,
      isFeatured: true,
      tags: ['Backlit Panel', 'Alu Profile', 'Downlighters'],
    },
    {
      id: '4',
      name: 'Striplights',
      description: '3000K 24V COB Striplights',
      price: 1800,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741637455/cob-led-strip-480-ledm-12v-ip20-118wm_omdvhy.jpg',
      category: 'Striplights',
      brand: 'QLA',
      rating: 4.7,
      inStock: true,
      isNew: true,
      specifications: ['3000K', '24V', 'COB'],
      tags: ['Warmwhite', 'cool daylight', 'daylight'],
    },
    {
      id: '5',
      name: 'Digital striplights',
      description: '24V 5meter RGB Digital Striplights',
      price: 3500,
      originalPrice: 4000,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741639005/H2f2ec3d4ffbb463db1048fbdf0fe3238f_cpllgg.webp',
      category: 'RBG-striplights',
      brand: 'QLA',
      rating: 4.6,
      inStock: true,
      specifications: ['24V', '5meter', '60Leds/meter', 'rgb'],
      tags: ['striplights', 'rgb', 'rgbw'],
    },
    {
      id: '6',
      name: 'Switches',
      description: 'One Gang 2 way switch',
      price: 429,
      image:
        'https://res.cloudinary.com/da5npawma/image/upload/v1741641315/images_eoqybm.png',
      category: 'Switches',
      brand: 'QLA',
      rating: 4.7,
      inStock: true,
      specifications: ['One Gang', '2 way', 'Wide'],
      tags: ['Sockets', 'Switch', 'Panel'],
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
    categories: [
      'Backlit-panels',
      'Striplights',
      'Switches',
      'RBG-striplights',
      'Aluminium-profiles',
    ],
    brands: ['QLA', 'Philips', 'Ledvanve'],
    priceRanges: [
      { label: 'Under $100', min: 0, max: 100 },
      { label: 'KES100 - KES500', min: 100, max: 500 },
      { label: 'KES500 - KES1000', min: 500, max: 1000 },
      { label: 'Over KES1000', min: 1000, max: Infinity },
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
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
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
