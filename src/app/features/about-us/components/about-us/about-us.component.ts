import { Component } from '@angular/core';
interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

interface CompanyStat {
  label: string;
  value: string;
  icon: string;
  description: string;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about-us',
  standalone: false,
  
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Tech enthusiast with 15+ years of experience in consumer electronics retail.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'CTO',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Former Silicon Valley engineer passionate about making technology accessible.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Head of Product',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Product strategist focusing on customer-centric innovation.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    }
  ];

  companyStats: CompanyStat[] = [
    {
      label: 'Happy Customers',
      value: '50K+',
      icon: 'fas fa-smile',
      description: 'Satisfied customers worldwide'
    },
    {
      label: 'Products',
      value: '10K+',
      icon: 'fas fa-box-open',
      description: 'Quality products available'
    },
    {
      label: 'Team Members',
      value: '100+',
      icon: 'fas fa-users',
      description: 'Dedicated professionals'
    },
    {
      label: 'Years Experience',
      value: '15+',
      icon: 'fas fa-calendar-alt',
      description: 'In consumer electronics'
    }
  ];

  companyValues: CompanyValue[] = [
    {
      title: 'Innovation',
      description: 'Constantly pushing boundaries to bring the latest technology to our customers.',
      icon: 'fas fa-lightbulb'
    },
    {
      title: 'Quality',
      description: 'Committed to providing only the highest quality products and services.',
      icon: 'fas fa-award'
    },
    {
      title: 'Customer Focus',
      description: 'Putting our customers first in everything we do.',
      icon: 'fas fa-heart'
    },
    {
      title: 'Sustainability',
      description: 'Working towards a greener future through eco-friendly practices.',
      icon: 'fas fa-leaf'
    }
  ];

  milestones = [
    {
      year: 2008,
      title: 'Company Founded',
      description: 'QLA was founded with a vision to revolutionize electronics retail.'
    },
    {
      year: 2012,
      title: 'National Expansion',
      description: 'Expanded operations nationwide with 50+ retail locations.'
    },
    {
      year: 2015,
      title: 'E-commerce Launch',
      description: 'Launched our online store to reach customers everywhere.'
    },
    {
      year: 2018,
      title: 'Innovation Award',
      description: 'Recognized as the most innovative electronics retailer.'
    },
    {
      year: 2020,
      title: 'Sustainability Initiative',
      description: 'Launched our eco-friendly packaging and recycling program.'
    },
    {
      year: 2023,
      title: 'Global Expansion',
      description: 'Expanded operations to international markets.'
    }
  ];
}