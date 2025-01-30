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
      name: 'Laptops & Computers',
      slug: 'laptops-computers',
      description: 'Find the perfect computer for work, gaming, or everyday use',
      icon: 'fas fa-laptop',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      featuredBrands: ['Apple', 'Dell', 'HP', 'Lenovo'],
      subcategories: [
        { name: 'Gaming Laptops', slug: 'gaming-laptops', count: 45 },
        { name: 'Business Laptops', slug: 'business-laptops', count: 38 },
        { name: 'Desktop PCs', slug: 'desktop-pcs', count: 29 },
        { name: 'PC Components', slug: 'pc-components', count: 156 }
      ],
      productCount: 268,
      isPopular: true
    },
    {
      id: '2',
      name: 'Smartphones & Tablets',
      slug: 'smartphones-tablets',
      description: 'Latest mobile devices from top brands',
      icon: 'fas fa-mobile-alt',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      featuredBrands: ['Apple', 'Samsung', 'Google', 'OnePlus'],
      subcategories: [
        { name: 'iPhones', slug: 'iphones', count: 12 },
        { name: 'Android Phones', slug: 'android-phones', count: 47 },
        { name: 'Tablets', slug: 'tablets', count: 24 },
        { name: 'E-readers', slug: 'e-readers', count: 8 }
      ],
      productCount: 91,
      isPopular: true
    },
    {
      id: '3',
      name: 'Audio & Headphones',
      slug: 'audio-headphones',
      description: 'Premium audio equipment for the best listening experience',
      icon: 'fas fa-headphones',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      featuredBrands: ['Sony', 'Bose', 'Sennheiser', 'JBL'],
      subcategories: [
        { name: 'Wireless Headphones', slug: 'wireless-headphones', count: 34 },
        { name: 'Earbuds', slug: 'earbuds', count: 28 },
        { name: 'Speakers', slug: 'speakers', count: 45 },
        { name: 'Home Audio', slug: 'home-audio', count: 19 }
      ],
      productCount: 126,
      isPopular: true
    },
    {
      id: '4',
      name: 'Gaming & Consoles',
      slug: 'gaming-consoles',
      description: 'Everything for the ultimate gaming setup',
      icon: 'fas fa-gamepad',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      featuredBrands: ['PlayStation', 'Xbox', 'Nintendo', 'Razer'],
      subcategories: [
        { name: 'Gaming Consoles', slug: 'consoles', count: 15 },
        { name: 'Video Games', slug: 'video-games', count: 324 },
        { name: 'Gaming Accessories', slug: 'gaming-accessories', count: 89 },
        { name: 'VR Gaming', slug: 'vr-gaming', count: 23 }
      ],
      productCount: 451,
      isPopular: true
    },
    {
      id: '5',
      name: 'Cameras & Photography',
      slug: 'cameras-photography',
      description: 'Capture life\'s moments with professional gear',
      icon: 'fas fa-camera',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      featuredBrands: ['Canon', 'Sony', 'Nikon', 'Fujifilm'],
      subcategories: [
        { name: 'DSLR Cameras', slug: 'dslr-cameras', count: 28 },
        { name: 'Mirrorless Cameras', slug: 'mirrorless-cameras', count: 34 },
        { name: 'Lenses', slug: 'camera-lenses', count: 156 },
        { name: 'Camera Accessories', slug: 'camera-accessories', count: 98 }
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
