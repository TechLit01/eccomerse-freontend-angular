import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User, UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = false;
  registrationError: string | null = null;
  registrationSuccess = false;
  
  // Password visibility toggle
  showPassword = false;
  showConfirmPassword = false;
  
  // Form steps
  currentStep = 1;
  totalSteps = 2;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Initialize the form with validations
  private initForm(): void {
    this.registrationForm = this.formBuilder.group({
      // Step 1: Basic Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-()]{10,20}$/)]],
      
      // Step 2: Password and Preferences
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      
      // Terms and marketing preferences
      agreeToTerms: [false, Validators.requiredTrue],
      marketingPreferences: this.formBuilder.group({
        emailOffers: [true],
        smsOffers: [false],
        personalizedAds: [true]
      })
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  // Custom validator to ensure passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Form submission handling
  onSubmit(): void {
    if (this.currentStep < this.totalSteps) {
      this.goToNextStep();
      return;
    }
    
    if (this.registrationForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registrationForm);
      return;
    }

    this.isSubmitting = true;
    this.registrationError = null;

    // Map form values to user object
    const formValues = this.registrationForm.value;
    const user: User = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      password: formValues.password,
      marketingPreferences: formValues.marketingPreferences
    };

    // Call the service to register the user
    this.usersService.register(user)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.registrationSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { registered: 'success', email: user.email }
            });
          }, 2000);
        },
        error: (error) => {
          this.registrationError = error.message || 'Registration failed. Please try again.';
        }
      });
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Multi-step form navigation
  goToNextStep(): void {
    // Validate current step before proceeding
    if (this.currentStep === 1) {
      const step1Controls = ['firstName', 'lastName', 'email', 'phone'];
      const invalidControls = step1Controls.filter(controlName => 
        this.registrationForm.get(controlName)?.invalid
      );
      
      if (invalidControls.length > 0) {
        // Mark invalid controls as touched to show errors
        invalidControls.forEach(controlName => 
          this.registrationForm.get(controlName)?.markAsTouched()
        );
        return;
      }
    }
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  // Password helpers
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Password strength indicators
  getPasswordStrength(): { strength: number; label: string; color: string } {
    const password = this.registrationForm.get('password')?.value || '';
    
    if (!password) {
      return { strength: 0, label: 'None', color: 'bg-slate-200 dark:bg-slate-700' };
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Map strength score to label and color
    if (strength <= 2) {
      return { strength: 1, label: 'Weak', color: 'bg-rose-500' };
    } else if (strength <= 4) {
      return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    } else {
      return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    }
  }

  // Helper methods for template to avoid regex in template expressions
  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password || '');
  }

  hasLowerCase(password: string): boolean {
    return /[a-z]/.test(password || '');
  }

  hasNumber(password: string): boolean {
    return /[0-9]/.test(password || '');
  }

  hasSpecialChar(password: string): boolean {
    return /[^A-Za-z0-9]/.test(password || '');
  }

  hasMinLength(password: string): boolean {
    return (password || '').length >= 8;
  }

  // Social login methods (to be implemented)
  loginWithGoogle(): void {
    // Implement OAuth login with Google
    console.log('Login with Google clicked');
  }

  loginWithFacebook(): void {
    // Implement OAuth login with Facebook
    console.log('Login with Facebook clicked');
  }

  loginWithApple(): void {
    // Implement OAuth login with Apple
    console.log('Login with Apple clicked');
  }
}