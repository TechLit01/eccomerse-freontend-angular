import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { catchError, of, finalize } from 'rxjs';
import { OrganizationService } from '../../services/organizations.service';
import { Organization, OrganizationCreateInput } from '../../../../shared/models/organization.model';

@Component({
  selector: 'app-organization-form',
  standalone: false,
  
  templateUrl: './organization-form.component.html',
  styleUrl: './organization-form.component.scss'
})
export class OrganizationFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  organizationId: number | null = null;
  isDark$ : any;
  isLoading = false;
  errorMessage: string | null = null;
  
  subscriptionPlans = [
    { id: 'BASIC', name: 'Basic', maxDevices: 1, maxUsers: 2, maxLocations: 1, price: 1000 },
    { id: 'STANDARD', name: 'Standard', maxDevices: 3, maxUsers: 5, maxLocations: 2, price: 2500 },
    { id: 'PREMIUM', name: 'Premium', maxDevices: 10, maxUsers: 15, maxLocations: 5, price: 5000 },
    { id: 'ENTERPRISE', name: 'Enterprise', maxDevices: 50, maxUsers: 100, maxLocations: 20, price: 10000 }
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService
  ) {
    this.isDark$ = this.themeService.isDarkTheme();
    this.form = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact: [''],
      address: [''],
      complementaryMessage: [''],
      
      // Payment Details
      bankDetails: [''],
      mpesaDetails: [''],
      stations: [''],
      
      // Subscription Details
      subscriptionPlan: ['BASIC', Validators.required],
      customLimits: [false],
      maxDevices: [{ value: 1, disabled: true }],
      maxUsers: [{ value: 2, disabled: true }],
      maxLocations: [{ value: 1, disabled: true }],
      autoRenew: [true]
    });
  }

  private initializeForm() {
    this.form = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact: [''],
      address: [''],
      complementaryMessage: [''],
      
      // Payment Details
      bankDetails: [''],
      mpesaDetails: [''],
      stations: [''],
      
      // Subscription Details
      subscriptionPlan: ['BASIC', Validators.required],
      customLimits: [false],
      maxDevices: [{ value: 1, disabled: true }],
      maxUsers: [{ value: 2, disabled: true }],
      maxLocations: [{ value: 1, disabled: true }],
      autoRenew: [true]
    });

    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions() {
    // Update limits when plan changes
    this.form.get('subscriptionPlan')?.valueChanges.subscribe(plan => {
      const selectedPlan = this.subscriptionPlans.find(p => p.id === plan);
      if (selectedPlan && !this.form.get('customLimits')?.value) {
        this.updatePlanLimits(selectedPlan);
      }
    });

    // Handle custom limits toggle
    this.form.get('customLimits')?.valueChanges.subscribe(isCustom => {
      const controls = ['maxDevices', 'maxUsers', 'maxLocations'];
      controls.forEach(control => {
        if (isCustom) {
          this.form.get(control)?.enable();
        } else {
          this.form.get(control)?.disable();
          const selectedPlan = this.subscriptionPlans.find(
            p => p.id === this.form.get('subscriptionPlan')?.value
          );
          if (selectedPlan) {
            this.updatePlanLimits(selectedPlan);
          }
        }
      });
    });
  }

  private updatePlanLimits(plan: any) {
    this.form.patchValue({
      maxDevices: plan.maxDevices,
      maxUsers: plan.maxUsers,
      maxLocations: plan.maxLocations
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.organizationId = parseInt(id);
      this.loadOrganization(this.organizationId);
    }
  }

  loadOrganization(id: number) {
    this.isLoading = true;
    this.organizationService.findOne(id).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to load organization details. Please try again.';
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe((org: Organization | null) => {
      if (org) {
        this.form.patchValue({
          ...org,
          subscriptionPlan: org.subscription?.plan || 'BASIC',
          maxDevices: org.subscription?.maxDevices,
          maxUsers: org.subscription?.maxUsers,
          maxLocations: org.subscription?.maxLocations,
          autoRenew: org.subscription?.autoRenew
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const formData = this.form.getRawValue();
      
      const organizationData: OrganizationCreateInput = {
        name: formData.name,
        address: formData.address,
        contact: formData.contact,
        complementaryMessage: formData.complementaryMessage,
        stations: formData.stations,
        bankDetails: formData.bankDetails,
        mpesaDetails: formData.mpesaDetails,
        subscriptionPlan: formData.subscriptionPlan,
        maxDevices: formData.maxDevices,
        maxUsers: formData.maxUsers,
        maxLocations: formData.maxLocations,
        autoRenew: formData.autoRenew
      };

      const request = this.isEditMode && this.organizationId
        ? this.organizationService.update(this.organizationId, organizationData)
        : this.organizationService.create(organizationData);

      request.pipe(
        catchError(error => {
          this.errorMessage = error.message || 'Failed to save organization. Please try again.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe((response: Organization | null) => {
        if (response) {
          this.router.navigate(['/organizations']);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/organizations']);
  }

  getPlanPrice(): number {
    const plan = this.subscriptionPlans.find(
      p => p.id === this.form.get('subscriptionPlan')?.value
    );
    return plan?.price || 0;
  }
}