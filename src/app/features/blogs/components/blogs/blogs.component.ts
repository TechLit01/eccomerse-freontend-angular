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
      title: 'The Future of AI in Consumer Electronics',
      excerpt: 'Exploring how artificial intelligence is revolutionizing everyday devices and what to expect in the coming years.',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Technology Trends',
      tags: ['AI', 'Smart Devices', 'Innovation'],
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Tech Analyst'
      },
      publishDate: new Date('2024-01-15'),
      readTime: 8,
      featured: true
    }
  ];

  blogPosts: BlogPost[] = [
    {
      id: '2',
      title: 'Top Gaming Laptops of 2024',
      excerpt: 'A comprehensive review of the best gaming laptops available in the market right now.',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Product Reviews',
      tags: ['Gaming', 'Laptops', 'Reviews'],
      author: {
        name: 'Michael Chen',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Product Reviewer'
      },
      publishDate: new Date('2024-01-10'),
      readTime: 12
    },
    {
      id: '3',
      title: 'Understanding 5G Technology',
      excerpt: 'Everything you need to know about 5G and its impact on mobile connectivity.',
      content: '...',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      category: 'Tech Guides',
      tags: ['5G', 'Mobile', 'Network'],
      author: {
        name: 'John Smith',
        avatar: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
        role: 'Tech Writer'
      },
      publishDate: new Date('2024-01-05'),
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
    'AI', '5G', 'Smart Home', 'Gaming', 'Mobile',
    'Laptops', 'Gadgets', 'Reviews', 'Innovation'
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