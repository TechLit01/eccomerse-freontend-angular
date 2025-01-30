import { Component, OnInit } from '@angular/core';
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
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [
    {
      name: 'Laptops',
      slug: 'laptops',
      icon: 'fas fa-laptop'
    },
    {
      name: 'Smartphones',
      slug: 'smartphones',
      icon: 'fas fa-mobile-alt'
    },
    {
      name: 'Tablets',
      slug: 'tablets',
      icon: 'fas fa-tablet-alt'
    },
    {
      name: 'Cameras',
      slug: 'cameras',
      icon: 'fas fa-camera'
    },
    {
      name: 'Audio',
      slug: 'audio',
      icon: 'fas fa-headphones'
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      icon: 'fas fa-plug'
    }
  ];

  featuredProducts: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      description: 'Latest M2 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'laptops'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      description: 'A17 Pro chip, 256GB, Titanium finish',
      price: 1199.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'smartphones'
    },
    {
      id: '3',
      name: 'iPad Pro 12.9"',
      description: 'M2 chip, 128GB, Space Gray',
      price: 1099.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'tablets'
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5',
      description: 'Wireless Noise Cancelling Headphones',
      price: 399.99,
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'audio'
    }
  ];

  constructor() {}

  ngOnInit() {
    // In the future, these would be API calls
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  private loadCategories() {
    // This would be an API call in production
    console.log('Loading categories...');
  }

  private loadFeaturedProducts() {
    // This would be an API call in production
    console.log('Loading featured products...');
  }

  addToCart(product: Product) {
    console.log('Adding to cart:', product);
    // This would trigger your cart service
  }

  addToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
    // This would trigger your wishlist service
  }
}