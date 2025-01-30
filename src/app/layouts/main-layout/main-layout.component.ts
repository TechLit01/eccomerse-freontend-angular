import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  isDarkMode = false;
  showBackToTop = false;
  currentYear = new Date().getFullYear();
  private routerSubscription?: Subscription;
  private themeSubscription?: Subscription;

  constructor(
    private router: Router,
    private titleService: Title,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Handle router events for loading state
    this.routerSubscription = this.router.events
      .pipe(filter(event => 
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ))
      .subscribe(event => {
        // Update loading state
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
          
          // Scroll to top on route change
          if (event instanceof NavigationEnd) {
            window.scrollTo(0, 0);
            this.updateTitle(event.urlAfterRedirects);
          }
        }
      });

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkTheme()
      .subscribe(isDark => {
        this.isDarkMode = isDark;
        // Update meta theme color
        this.updateThemeColor(isDark);
      });

    // Check initial scroll position
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll() {
    // Show/hide back to top button based on scroll position
    this.showBackToTop = window.pageYOffset > 400;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private updateTitle(url: string) {
    // Set default title
    let title = 'StyleStore';
    
    // Add page specific titles
    if (url.includes('/products')) {
      title = 'Products | StyleStore';
    } else if (url.includes('/cart')) {
      title = 'Shopping Cart | StyleStore';
    } else if (url.includes('/checkout')) {
      title = 'Checkout | StyleStore';
    } else if (url.includes('/account')) {
      title = 'My Account | StyleStore';
    }

    this.titleService.setTitle(title);
  }

  private updateThemeColor(isDark: boolean) {
    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDark ? '#0f172a' : '#f8fafc'
      );
    }
  }

  ngOnDestroy() {
    // Cleanup subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}