import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-hearder',
  standalone: false,
  
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HeaderComponent implements OnInit {
  @ViewChild('profileDropdown') profileDropdown!: ElementRef;
  isDark = false;
  isProfileOpen = false;
  isMobileMenuOpen = false;
  currentDateTime: string = '';
  currentUser="shaphan"

  menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      path: '/organizations', 
      label: 'Organizations',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    { 
      path: '/subscriptions', 
      label: 'Subscriptions',
      icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
    },
    { 
      path: '/payments', 
      label: 'Payments',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    },
  ];

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.updateDateTime();
    // Update time every second
    setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnInit() {
    this.themeService.isDarkTheme().subscribe(
      isDark => this.isDark = isDark
    );
    this.setupClickOutsideListener();
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDateTime = formatDate(now, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0300');
  }

  private setupClickOutsideListener() {
    // Close profile dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target as Node)) {
        this.isProfileOpen = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Close mobile menu on window resize (e.g., when switching to desktop view)
    if (window.innerWidth >= 1024) { // lg breakpoint
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    // Close mobile menu and profile dropdown when ESC key is pressed
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
    // Close profile dropdown when opening mobile menu
    if (this.isMobileMenuOpen) {
      this.isProfileOpen = false;
    }
  }

  async logout() {
    try {
      // await this.authService.logout();
      this.isProfileOpen = false;
      this.isMobileMenuOpen = false;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Helper method to get formatted time for display
  getFormattedDateTime(): string {
    const [date, time] = this.currentDateTime.split(' ');
    return `${date} ${time} UTC`;
  }

  // Clean up subscriptions and event listeners
  ngOnDestroy() {
    // Clear the interval when component is destroyed
    if (this.updateDateTime) {
      clearInterval(this.updateDateTime as unknown as number);
    }
  }
}