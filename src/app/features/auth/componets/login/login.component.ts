import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginCredentials } from '../../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    this.authService.isAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/admin/dashboard']);
        }
      }
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      const { email, password, rememberMe } = this.loginForm.value;
      const loginCredentials: LoginCredentials = { email, password };
      
      this.authService.login(loginCredentials).subscribe({
        next: () => {
          if (rememberMe) {
            // Implement remember me functionality
            localStorage.setItem('rememberMe', 'true');
          }
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Invalid credentials';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
