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
      name: 'Backlit Panels',
      slug: 'backlit-panels',
      icon: 'fas fa-laptop'
    },
    {
      name: 'Downlighters',
      slug: 'downlighters',
      icon: 'fas fa-mobile-alt'
    },
    {
      name: 'Aluminium Profiles',
      slug: 'aluminium-profiles',
      icon: 'fas fa-tablet-alt'
    },
    {
      name: 'RGBW Strips',
      slug: 'rgbw-strips',
      icon: 'fas fa-camera'
    },
    {
      name: 'Panel Lights',
      slug: 'panel-lights',
      icon: 'fas fa-headphones'
    },
    {
      name: 'Switches',
      slug: 'switches',
      icon: 'fas fa-plug'
    }
  ];

  featuredProducts: Product[] = [
    {
      id: '1',
      name: 'Backlit Panel',
      description: '40 watts, 100lm/w ',
      price: 2499.99,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637120/led-panel-lights-600x600-1_zjzxdq.webp',
      category: 'backlit-panels'
    },
    {
      id: '2',
      name: 'Aluminium Profile',
      description: '10*10 Reccesed Aluminium Profile',
      price: 400,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637249/alu17_aluminium_led_profile_with_warm_white_led_strip_dyt7r3.webp',
      category: 'aluminium-profiles'
    },
    {
      id: '3',
      name: 'Strip Lights"',
      description: 'COB Strip Lights',
      price: 1800,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637455/cob-led-strip-480-ledm-12v-ip20-118wm_omdvhy.jpg',
      category: 'Strrip Lights'
    },
    {
      id: '4',
      name: 'Downlighters',
      description: '12W Downlights',
      price: 495,
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      category: 'downlighters'
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