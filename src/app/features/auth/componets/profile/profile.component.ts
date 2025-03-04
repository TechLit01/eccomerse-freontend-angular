import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User, UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/auth.service';

interface Order {
  id: string;
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  trackingNumber?: string;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // User data
  currentUser: User | null = null;
  isLoading = true;
  
  // Tabs
  activeTab: 'overview' | 'orders' | 'addresses' | 'security' | 'preferences' = 'overview';
  
  // Forms
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  passwordForm!: FormGroup;
  
  // Form states
  isUpdating = false;
  updateSuccess = false;
  updateError: string | null = null;
  
  // Addresses
  addresses: Address[] = [];
  editingAddressId: string | null = null;
  
  // Orders
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  
  // File upload
  selectedFile: File | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
    this.loadOrders();
    this.loadAddresses();
  }
  
  private initForms(): void {
    // Profile form
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-()]{10,20}$/)]]
    });
    
    // Address form
    this.addressForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Kenya', Validators.required],
      phone: [''],
      isDefault: [false]
    });
    
    // Password form
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }
  
  // Custom validator to ensure passwords match
  passwordMatchValidator(group: FormGroup): any {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  // Load user data and populate form
  private loadUserData(): void {
    this.isLoading = true;
    
    this.usersService.getCurrentUserr()?.subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
          
          // Populate form with user data
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || ''
          });
        } else {
          // Handle case where user is not logged in
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  // Mock data for demonstration - replace with actual API calls
  private loadOrders(): void {
    // Simulate API call
    setTimeout(() => {
      this.orders = [
        {
          id: 'ORD-12345',
          date: new Date(2025, 0, 15),
          total: 349.99,
          status: 'delivered',
          items: [
            { id: 'PROD-001', name: 'LED Panel Light', price: 129.99, quantity: 2 },
            { id: 'PROD-002', name: 'Smart LED Bulb', price: 45.99, quantity: 1 }
          ],
          trackingNumber: 'TRK-987654321'
        },
        {
          id: 'ORD-12346',
          date: new Date(2025, 1, 2),
          total: 89.99,
          status: 'shipped',
          items: [
            { id: 'PROD-003', name: 'LED Strip Lights', price: 89.99, quantity: 1 }
          ],
          trackingNumber: 'TRK-123456789'
        },
        {
          id: 'ORD-12347',
          date: new Date(2025, 1, 14),
          total: 234.97,
          status: 'processing',
          items: [
            { id: 'PROD-004', name: 'Outdoor LED Floodlight', price: 79.99, quantity: 2 },
            { id: 'PROD-005', name: 'LED Motion Sensor Light', price: 74.99, quantity: 1 }
          ]
        }
      ];
    }, 1000);
  }
  
  private loadAddresses(): void {
    // Simulate API call
    setTimeout(() => {
      this.addresses = [
        {
          id: 'addr-1',
          name: 'Home',
          street: '123 Main Street',
          city: 'Nairobi',
          state: 'Nairobi County',
          zipCode: '00100',
          country: 'Kenya',
          isDefault: true,
          phone: '+254712345678'
        },
        {
          id: 'addr-2',
          name: 'Office',
          street: '456 Business Avenue',
          city: 'Mombasa',
          state: 'Mombasa County',
          zipCode: '80100',
          country: 'Kenya',
          isDefault: false,
          phone: '+254723456789'
        }
      ];
    }, 1000);
  }
  
  // Update profile information
  updateProfile(): void {
    if (this.profileForm.invalid) {
      // Mark form controls as touched to trigger validation visuals
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = null;
    
    const updatedUser: Partial<User> = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      email: this.profileForm.get('email')?.value,
      phone: this.profileForm.get('phone')?.value
    };
    
    this.usersService.simulateUpdateProfile(updatedUser)
      .pipe(
        finalize(() => {
          this.isUpdating = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.currentUser = response;
          this.updateSuccess = true;
          
          // Reset success message after delay
          setTimeout(() => {
            this.updateSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.updateError = error.message || 'Failed to update profile. Please try again.';
        }
      });
  }
  
  // Change password
  changePassword(): void {
    if (this.passwordForm.invalid) {
      // Mark form controls as touched to trigger validation visuals
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = null;
    
    // Simulate password change - replace with actual API call
    setTimeout(() => {
      this.isUpdating = false;
      this.updateSuccess = true;
      this.passwordForm.reset();
      
      // Reset success message after delay
      setTimeout(() => {
        this.updateSuccess = false;
      }, 5000);
    }, 1500);
  }
  
  // Address management
  addAddress(): void {
    this.editingAddressId = null;
    this.addressForm.reset();
    this.addressForm.patchValue({
      country: 'Kenya',
      isDefault: false
    });
    
    // Show address form by switching to addresses tab
    this.activeTab = 'addresses';
  }
  
  editAddress(address: Address): void {
    this.editingAddressId = address.id;
    this.addressForm.patchValue({
      id: address.id,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault
    });
    
    // Ensure addresses tab is active
    this.activeTab = 'addresses';
  }
  
  saveAddress(): void {
    if (this.addressForm.invalid) {
      // Mark form controls as touched to trigger validation visuals
      Object.keys(this.addressForm.controls).forEach(key => {
        this.addressForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const addressData = this.addressForm.value;
    
    if (this.editingAddressId) {
      // Update existing address
      const index = this.addresses.findIndex(a => a.id === this.editingAddressId);
      if (index !== -1) {
        // If setting as default, update other addresses
        if (addressData.isDefault) {
          this.addresses.forEach(a => {
            a.isDefault = false;
          });
        }
        
        this.addresses[index] = {
          ...this.addresses[index],
          ...addressData
        };
      }
    } else {
      // Add new address
      const newId = `addr-${Date.now()}`;
      
      // If setting as default, update other addresses
      if (addressData.isDefault) {
        this.addresses.forEach(a => {
          a.isDefault = false;
        });
      }
      
      this.addresses.push({
        ...addressData,
        id: newId
      });
    }
    
    // Reset form
    this.addressForm.reset();
    this.editingAddressId = null;
    
    // Show success message
    this.updateSuccess = true;
    setTimeout(() => {
      this.updateSuccess = false;
    }, 5000);
  }
  
  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addresses = this.addresses.filter(a => a.id !== addressId);
      
      // If editing this address, reset form
      if (this.editingAddressId === addressId) {
        this.addressForm.reset();
        this.editingAddressId = null;
      }
    }
  }
  
  // Order management
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }
  
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
  
  // Navigation
  setActiveTab(tab: 'overview' | 'orders' | 'addresses' | 'security' | 'preferences'): void {
    this.activeTab = tab;
    
    // Reset forms when switching tabs
    if (tab === 'security') {
      this.passwordForm.reset();
    }
  }
  
  // Profile image handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProfileImage();
    }
  }
  
  uploadProfileImage(): void {
    if (!this.selectedFile) {
      return;
    }
    
    // Simulate file upload - replace with actual API call
    this.isUpdating = true;
    
    setTimeout(() => {
      if (this.currentUser && this.selectedFile) {
        // Create object URL for preview (in a real app, this would be a URL from your server/CDN)
        const imageUrl = URL.createObjectURL(this.selectedFile);
        
        // Update user profile with new image URL
        this.currentUser = {
          ...this.currentUser,
          profileImage: imageUrl
        };
      }
      
      this.isUpdating = false;
      this.selectedFile = null;
    }, 1500);
  }
  
  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  // Get order status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-500';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  }
  
  // Log out user
  logout(): void {
    this.authService.logout()
  }
}