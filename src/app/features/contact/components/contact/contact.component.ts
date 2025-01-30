import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  value: string;
  link?: string;
}

interface OfficeLocation {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  image: string;
}

@Component({
  selector: 'app-contact',
  standalone: false,
  
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  contactMethods: ContactMethod[] = [
    {
      icon: 'fas fa-phone-alt',
      title: 'Call Us',
      description: 'Talk to our friendly team',
      value: '+1 (800) QLA-TECH',
      link: 'tel:+18007582324'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      description: 'We\'ll respond within 24 hours',
      value: 'support@qla.com',
      link: 'mailto:support@qla.com'
    },
    {
      icon: 'fas fa-comments',
      title: 'Live Chat',
      description: 'Available 24/7 for instant support',
      value: 'Start a conversation'
    },
    {
      icon: 'fas fa-ticket-alt',
      title: 'Support Ticket',
      description: 'Create a ticket for complex issues',
      value: 'Open ticket system'
    }
  ];

  officeLocations: OfficeLocation[] = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 Tech Street, Innovation District, CA 94025',
      phone: '+1 (800) 758-2324',
      email: 'sf@qla.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM PST',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg'
    },
    {
      city: 'New York',
      country: 'United States',
      address: '456 Tech Avenue, Digital District, NY 10013',
      phone: '+1 (800) 758-2325',
      email: 'ny@qla.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM EST',
      image: 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1732995563/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.large_pdjiwf.jpg'
    }
  ];

  faqCategories = [
    'General Inquiries',
    'Product Support',
    'Orders & Shipping',
    'Returns & Refunds'
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+\\-\\s()]*$')]],  // Fixed regex pattern
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      category: ['General Inquiries'],
      agreeToPolicies: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    // Any initialization code
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.submitSuccess = true;
        this.contactForm.reset({
          category: 'General Inquiries',
          agreeToPolicies: false
        });
      } catch (error) {
        this.submitError = true;
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
      if (control.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}