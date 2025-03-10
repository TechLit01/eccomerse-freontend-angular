import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
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

interface Milestone {
  year: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-us',
  standalone: false,

  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Charles Van',
      role: 'CEO & Founder',
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Tech enthusiast with 15+ years of experience in consumer electronics retail.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'CTO',
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Former Silicon Valley engineer passionate about making technology accessible.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Head of Product',
      image:
        'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg',
      bio: 'Product strategist focusing on customer-centric innovation.',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    },
  ];

  companyStats: CompanyStat[] = [
    {
      label: 'Happy Customers',
      value: '50K+',
      icon: 'fas fa-smile',
      description: 'Satisfied customers worldwide',
    },
    {
      label: 'Products',
      value: '10K+',
      icon: 'fas fa-box-open',
      description: 'Quality products available',
    },
    {
      label: 'Team Members',
      value: '100+',
      icon: 'fas fa-users',
      description: 'Dedicated professionals',
    },
    {
      label: 'Years Experience',
      value: '15+',
      icon: 'fas fa-calendar-alt',
      description: 'In consumer electronics',
    },
  ];

  companyValues: CompanyValue[] = [
    {
      title: 'Innovation',
      description:
        'Constantly pushing boundaries to bring the latest technology to our customers.',
      icon: 'fas fa-lightbulb',
    },
    {
      title: 'Quality',
      description:
        'Committed to providing only the highest quality products and services.',
      icon: 'fas fa-award',
    },
    {
      title: 'Customer Focus',
      description: 'Putting our customers first in everything we do.',
      icon: 'fas fa-heart',
    },
    {
      title: 'Sustainability',
      description:
        'Working towards a greener future through eco-friendly practices.',
      icon: 'fas fa-leaf',
    },
  ];

  milestones: Milestone[] = [
    {
      year: 2006,
      title: 'Company Founded',
      description:
        'The company was founded with a vision to revolutionize LED Lighting, custom-made projects, good quality and excellent service',
    },
    {
      year: 2006,
      title: 'What we deal in',
      description:
        'Wholesale Large (full range) stock Flexibel, Custom-made Installation & Support Consultancy,',
    },
    {
      year: 2007,
      title: 'Support',
      description:
        'Light Calculations, Own development (OEM) Fast delivery, Innovation Software support',
    },
    {
      year: 2007,
      title: 'Sustainability Initiative',
      description: 'Launched our eco-friendly packaging and recycling program.',
    },
    {
      year: 2023,
      title: 'Global Expansion',
      description: 'Expanded operations to international markets.',
    },
  ];

  // Animation and Parallax Properties
  scrollPosition = 0;
  animationElements: HTMLElement[] = [];

  constructor() {}

  ngOnInit(): void {
    // Sort milestones chronologically
    this.milestones.sort((a, b) => a.year - b.year);
  }

  ngAfterViewInit(): void {
    // Set up scroll animations
    this.setupScrollAnimations();

    // Add timeline animation classes
    this.setupTimelineAnimations();

    // Initialize counter animations
    this.initializeCounters();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Get current scroll position
    this.scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Update parallax effect
    this.updateParallax();

    // Check for elements to animate on scroll
    this.checkScrollAnimations();
  }

  private setupScrollAnimations(): void {
    // Get all elements with the 'scroll-reveal' class
    this.animationElements = Array.from(
      document.querySelectorAll('.scroll-reveal')
    ) as HTMLElement[];
  }

  private setupTimelineAnimations(): void {
    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll(
      '.timeline-item'
    ) as NodeListOf<HTMLElement>;
    timelineItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }

  private updateParallax(): void {
    const parallaxBg = document.querySelector('.parallax-bg') as HTMLElement;
    if (parallaxBg) {
      // Move the background at a slower rate than scroll speed
      const yPos = -(this.scrollPosition * 0.5);
      parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
  }

  private checkScrollAnimations(): void {
    // Check each animation element
    this.animationElements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // If element is in viewport
      if (elementPosition < windowHeight * 0.85) {
        element.classList.add('revealed');
      }
    });
  }

  private initializeCounters(): void {
    // For a more advanced implementation, you could add a library
    // that animates counting from 0 to the target number
    console.log('Initializing counter animations');
  }

  // Utility method for smooth scrolling to a section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Form handling
  submitContactForm(event: Event): void {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  }
}
