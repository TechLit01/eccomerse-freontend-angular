import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../features/orders/services/cart.service';
import { SearchService } from '../../../features/orders/services/search.service';
import { WishlistService } from '../../../features/orders/services/wishlist.service';

interface Category {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-hearder',
  standalone: false,
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HeaderComponent implements OnInit {
  @ViewChild('profileDropdown') profileDropdown!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  isDark = false;
  isProfileOpen = false;
  isMobileMenuOpen = false;
  activeMegaMenu = false;
  cartItemsCount = 0;
  wishlistItemsCount = 0;
  currentUser: string | null = null;
  isSearching = false;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  categories: Category[] = [
    { 
      name: 'Home',
      slug: '',
      icon: 'fas fa-laptop',
      description: 'MacBooks, Gaming Laptops, Desktop PCs'
    },
    { 
      name: 'Shop',
      slug: 'shop',
      icon: 'fas fa-mobile-alt',
      description: 'iPhones, Samsung, Google Pixel'
    },
    { 
      name: 'Products',
      slug: 'products',
      icon: 'fas fa-gamepad',
      description: 'Consoles, Games, Accessories'
    },
    { 
      name: 'Categories',
      slug: 'categories',
      icon: 'fas fa-tv',
      description: 'Smart TVs, Projectors, Soundbars'
    },
    { 
      name: 'About Us',
      slug: 'about-us',
      icon: 'fas fa-headphones',
      description: 'Headphones, Speakers, Microphones'
    },
    { 
      name: 'Blogs',
      slug: 'blogs',
      icon: 'fas fa-home',
      description: 'Security, Lighting, Smart Assistants'
    },
    
    { 
      name: 'Contact Us',
      slug: 'contact-us',
      icon: 'fas fa-plug',
      description: 'Chargers, Cases, Cables'
    },
    { 
      name: 'Admin',
      slug: 'admin',
      icon: 'fas fa-tag',
      description: 'Special Offers & Clearance'
    }
  ];

  // Featured brands for mega menu
  brands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus',
    'Bose', 'Microsoft', 'Google', 'Logitech', 'Canon', 'DJI'
  ];

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private searchService: SearchService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.setupSearchDebounce();
  }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isDarkTheme().subscribe(
      isDark => this.isDark = isDark
    );

    // Subscribe to cart updates - now using getCartItemsCount() for total items
    this.cartService.cartItems$.subscribe(() => {
      this.cartItemsCount = this.cartService.getCartItemsCount();
    });

    // Subscribe to wishlist updates
    this.wishlistService.wishlistItems$.subscribe(
      items => this.wishlistItemsCount = items.length
    );

    // Get current user
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user ? user.firstName : null
    );

    this.setupClickOutsideListener();
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  private setupClickOutsideListener() {
    document.addEventListener('click', (event) => {
      if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target as Node)) {
        this.isProfileOpen = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 1024) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.isMobileMenuOpen = false;
    this.isProfileOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDark = !this.isDark;
  }

  toggleProfile(event: Event) {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
  }

  toggleMobileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProfileOpen = false;
    }
  }
  
  onSearchInput(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  private performSearch(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.searchService.search(searchTerm).subscribe({
      next: (results) => {
        this.router.navigate(['/search'], { 
          queryParams: { q: searchTerm }
        });
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
    this.isMobileMenuOpen = false;
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
    this.isMobileMenuOpen = false;
  }

  goToSupport() {
    this.router.navigate(['/support']);
    this.isMobileMenuOpen = false;
  }

  goToOrders() {
    this.router.navigate(['/account/orders']);
    this.isMobileMenuOpen = false;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.isProfileOpen = false;
      this.isMobileMenuOpen = false;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}