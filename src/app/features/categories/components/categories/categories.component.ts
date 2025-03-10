import { Component } from '@angular/core';
interface Subcategory {
  name: string;
  slug: string;
  count: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  featuredBrands: string[];
  subcategories: Subcategory[];
  productCount: number;
  isPopular?: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: false,
  
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: Category[] = [
    {
      id: '1',
      name: 'Backlit Panels',
      slug: 'backlit-panels',
      description: 'Best Panels for your office layout',
      icon: 'fas fa-laptop',
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637120/led-panel-lights-600x600-1_zjzxdq.webp',
      featuredBrands: ['QLA',],
      subcategories: [
        { name: 'RGB Strips', slug: 'RGB-Strips', count: 45 },
        { name: 'Backlit Panels', slug: 'backlit-panels', count: 38 },
        { name: 'Downlighters', slug: 'Downlighters', count: 29 },
        { name: 'Aluminium Profiles', slug: 'Aluminium-profiles', count: 156 }
      ],
      productCount: 268,
      isPopular: true
    },
    {
      id: '2',
      name: 'Strip Lights',
      slug: 'RGBW Strips',
      description: 'Digital RGB Strips',
      icon: 'fas fa-mobile-alt',
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637455/cob-led-strip-480-ledm-12v-ip20-118wm_omdvhy.jpg',
      featuredBrands: ['RGB', 'RGBW', 'Digital', '5050'],
      subcategories: [
        { name: 'Backlit Panels', slug: 'Backlit-panels', count: 12 },
        { name: 'RGBW Strips', slug: 'RGBW-Strips', count: 47 },
        { name: 'Aluminium Profiles', slug: 'Aluminium-profiles', count: 24 },
        { name: 'Downlighters', slug: 'downlighters', count: 8 }
      ],
      productCount: 91,
      isPopular: true
    },
    {
      id: '3',
      name: 'Downlighters',
      slug: 'downlighters',
      description: 'Premium quality downlights',
      icon: 'fas fa-headphones',
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      featuredBrands: ['CCT', '3000K', '4000K', '6000K'],
      subcategories: [
        { name: 'Backlit Panels', slug: 'Baclit-panels', count: 12 },
        { name: 'RGBW Strips', slug: 'RGBW-Strips', count: 47 },
        { name: 'Aluminium Profiles', slug: 'Aluminium-profiles', count: 24 },
        { name: 'Downlighters', slug: 'downlighters', count: 8 }
      ],
      productCount: 126,
      isPopular: true
    },
    {
      id: '4',
      name: 'Aluminium Profiles',
      slug: 'Aluminium-profiles',
      description: 'Quality Aluminium Profiles',
      icon: 'fas fa-gamepad',
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637249/alu17_aluminium_led_profile_with_warm_white_led_strip_dyt7r3.webp',
      featuredBrands: ['Recessed', 'Surface', 'Conner Profile', 'Flexible'],
      subcategories: [
        { name: 'Backlit Panels', slug: 'Baclit-panels', count: 12 },
        { name: 'RGBW Strips', slug: 'RGBW-Strips', count: 47 },
        { name: 'Aluminium Profiles', slug: 'Aluminium-profiles', count: 24 },
        { name: 'Downlighters', slug: 'downlighters', count: 8 }
      ],
      productCount: 451,
      isPopular: true
    },
    {
      id: '5',
      name: 'Downlighters',
      slug: 'downlighters',
      description: 'Quality Downlighters',
      icon: 'fas fa-camera',
      image: 'https://res.cloudinary.com/da5npawma/image/upload/v1741637794/surya-4w-aura-prime-led-downlighter-recessed-led-d-o-1apZf515_z2of7i.jpg',
      featuredBrands: ['3W', '5W', '7W', '9W', '12W'],
      subcategories: [
        { name: 'Backlit Panels', slug: 'Baclit-panels', count: 12 },
        { name: 'RGBW Strips', slug: 'RGBW-Strips', count: 47 },
        { name: 'Aluminium Profiles', slug: 'Aluminium-profiles', count: 24 },
        { name: 'Downlighters', slug: 'downlighters', count: 8 }
      ],
      productCount: 316
    }
  ];

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  calculateDiscount(categoryId: string): number {
    // This would normally come from a service
    const discounts: { [key: string]: number } = {
      '1': 15,
      '2': 20,
      '3': 10,
      '4': 25,
      '5': 30
    };
    return discounts[categoryId] || 0;
  }
}
