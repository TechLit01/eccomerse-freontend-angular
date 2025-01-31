import { Component, OnInit } from '@angular/core';
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishDate: Date;
  readTime: number;
  featured?: boolean;
}
@Component({
  selector: 'app-blogs',
  standalone: false,
  
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit {
  featuredPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Why LED?',
      excerpt: 'Understanding LED Performance',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Energy Efficiency and Cost Savings',
      tags: ['IOT Devices', 'Strip Lights', 'Backlit Panels'],
      author: {
        name: 'QLA',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Tech Analyst'
      },
      publishDate: new Date('2025-01-15'),
      readTime: 8,
      featured: true
    }
  ];

  blogPosts: BlogPost[] = [
    {
      id: '2',
      title: 'Energy efficiency',
      excerpt: ' LED lights consume significantly less energy than traditional incandescent bulbs, resulting in lower electricity bills and reduced carbon emissions. They can be up to 80% more efficient than traditional lighting.',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Product Reviews',
      tags: ['LEDs', 'RGBW', 'Backlit'],
      author: {
        name: 'QLA',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Product Reviewer'
      },
      publishDate: new Date('2025-01-10'),
      readTime: 12
    },
    {
      id: '3',
      title: 'Longevity',
      excerpt: 'LED lights have a much longer lifespan than traditional bulbs, which means they need to be replaced less frequently. This makes them a cost-effective option in the long term.',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'QLA',
      tags: ['Downlighters', 'RGB', 'Neon'],
      author: {
        name: 'QLA',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Engineer'
      },
      publishDate: new Date('2025-01-05'),
      readTime: 10
    }
  ];

  categories = [
    { name: 'All Posts', value: 'all' },
    { name: 'Technology Trends', value: 'tech-trends' },
    { name: 'Product Reviews', value: 'product-reviews' },
    { name: 'Tech Guides', value: 'tech-guides' },
    { name: 'News & Updates', value: 'news' },
    { name: 'Tips & Tricks', value: 'tips' }
  ];

  popularTags = [
    'IOT Devices', 'Backlit Panels', 'Smart Home', 'LED', 'RGBW',
    'Neon', 'Aluminium Profiles', 'Strip Lights', 'Downlighters'
  ];

  selectedCategory = 'all';
  selectedSort = 'latest';
  isLoading = false;

  constructor() { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.loadPosts();
  }

  sortPosts(sortBy: string) {
    this.selectedSort = sortBy;
    // Implement sorting logic
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}