import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Initialize theme on service creation
    this.initializeTheme();

    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (localStorage.getItem('theme') === null) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  private isValidTheme(theme: string | null): theme is Theme {
    return theme === 'dark' || theme === 'light';
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    
    if (this.isValidTheme(savedTheme)) {
      // Use saved theme preference if valid
      this.setTheme(savedTheme);
    } else {
      // Use system preference if no valid saved theme
      this.setTheme(this.mediaQuery.matches ? 'dark' : 'light');
    }
  }

  private setTheme(theme: Theme): void {
    const isDark = theme === 'dark';
    this.isDarkMode.next(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this.isDarkMode.value ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  isDarkTheme() {
    return this.isDarkMode.asObservable();
  }

  getCurrentTheme(): Theme {
    return this.isDarkMode.value ? 'dark' : 'light';
  }
}