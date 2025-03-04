import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginCredentials } from '../../../../core/models/auth.models';
import { finalize, catchError, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;
  redirectURL: string | null = null;
  
  // For showing registration success message
  registrationSuccess = false;
  registeredEmail: string | null = null;
  
  // For cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check for query params (like redirect or registration success)
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // Set redirect URL if present
        if (params['redirect']) {
          this.redirectURL = params['redirect'];
        }
        
        // Check for successful registration
        if (params['registered'] === 'success') {
          this.registrationSuccess = true;
          this.registeredEmail = params['email'] || null;
          
          // Pre-fill email field if available
          if (this.registeredEmail) {
            this.loginForm.get('email')?.setValue(this.registeredEmail);
          }
        }
      });

    // Check if user is already logged in - with error handling
    this.authService.isAuthenticated()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Authentication check failed:', err);
          return of(false);
        })
      )
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          // If already logged in, redirect to intended destination or dashboard
          const redirectTo = this.redirectURL || '/profile';
          this.router.navigate([redirectTo])
            .catch(err => console.error('Navigation error:', err));
        }
      });
    
    // Check for remembered email if supported
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.get('email')?.setValue(rememberedEmail);
      this.loginForm.get('rememberMe')?.setValue(true);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Prevent multiple submissions
      if (this.isLoading) {
        return;
      }
      
      this.isLoading = true;
      this.error = null;
      
      // Get form values
      const { email, password, rememberMe } = this.loginForm.value;
      const loginCredentials: LoginCredentials = { email, password };
      
      console.log('Submitting login credentials:', { email, password: '******' });
      
      // Add finalize to ensure isLoading is reset
      this.authService.login(loginCredentials)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            console.log('Login attempt completed');
          }),
          catchError(err => {
            console.error('Login error caught in component:', err);
            this.error = err.error?.message || 'Invalid email or password';
            return of(null); // Return a null user instead of throwing
          })
        )
        .subscribe({
          next: (user) => {
            if (!user) {
              console.error('No user returned from login');
              return;
            }
            
            console.log('Login successful, user:', user);
            
            if (rememberMe) {
              // Save email for remember me functionality
              localStorage.setItem('rememberedEmail', email);
            } else {
              // Clear remembered email if remember me is not checked
              localStorage.removeItem('rememberedEmail');
            }
            
            // Navigate to intended destination or dashboard
            const redirectTo = this.redirectURL || '/profile';
            console.log('Redirecting to:', redirectTo);
            
            // Use try-catch for navigation
            try {
              // Use setTimeout to avoid potential zone.js issues
              setTimeout(() => {
                this.router.navigate([redirectTo])
                  .then(() => console.log('Navigation successful'))
                  .catch(err => console.error('Navigation error:', err));
              }, 0);
            } catch (e) {
              console.error('Error during navigation:', e);
            }
          }
        });
    } else {
      // Form is invalid
      this.loginForm.markAllAsTouched();
      console.warn('Login form is invalid', this.loginForm.errors);
    }
  }
  
  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  // Social login methods
  loginWithGoogle() {
    this.isLoading = true;
    this.error = null;
    
    // In a real implementation, this would use an OAuth provider
    console.log('Google login clicked');
    
    // Simulate API call delay
    setTimeout(() => {
      this.error = 'Google login is not implemented yet';
      this.isLoading = false;
    }, 1000);
  }
  
  loginWithFacebook() {
    this.isLoading = true;
    this.error = null;
    
    // In a real implementation, this would use an OAuth provider
    console.log('Facebook login clicked');
    
    // Simulate API call delay
    setTimeout(() => {
      this.error = 'Facebook login is not implemented yet';
      this.isLoading = false;
    }, 1000);
  }
}