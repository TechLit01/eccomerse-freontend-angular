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
      year: 2006,
      title: 'Company Founded',
      description: 'The company was founded with a vision to revolutionize LED Lighting,custom-made projects, good quality and excellent service'
    },
  
    {
      year: 2006,
      title: 'What we deal in',
      description: 'Wholesale Large (full range) stock Flexibel, Custom-made Installation & Support Consultancy,'
    },
    {
      year: 2007,
      title: 'Support',
      description: 'Light Calculations, Own development (OEM) Fast delivery, Innovation Software support'
    },
    {
      year: 2007,
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