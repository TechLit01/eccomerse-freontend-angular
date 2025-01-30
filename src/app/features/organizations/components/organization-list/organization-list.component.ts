import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { OrganizationService } from '../../services/organizations.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Organization, SubscriptionStatus } from '../../../../shared/models/organization.model';



@Component({
  selector: 'app-organization-list',
  standalone: false,
  
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.scss'
})
export class OrganizationListComponent implements OnInit {
  organizations: Organization[] = [];
  isDark$: any;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private organizationService: OrganizationService,
    private authService: AuthService,
  ) {
    this.isDark$ = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    console.log('Loading organizations...');
    this.organizationService.findAll().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        console.log(this.organizations);
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
      }
    });
  }

  getSubscriptionStatusClass(status: SubscriptionStatus | undefined): string {
    if (!status) return 'px-2 py-1 text-gray-600 bg-gray-100 rounded-full';
    
    const statusClasses = {
      [SubscriptionStatus.ACTIVE]: 'px-2 py-1 text-green-600 bg-green-100 rounded-full',
      [SubscriptionStatus.INACTIVE]: 'px-2 py-1 text-red-600 bg-red-100 rounded-full',
      [SubscriptionStatus.PENDING]: 'px-2 py-1 text-yellow-600 bg-yellow-100 rounded-full',
      [SubscriptionStatus.CANCELLED]: 'px-2 py-1 text-gray-600 bg-gray-100 rounded-full',
      [SubscriptionStatus.EXPIRED]: 'px-2 py-1 text-red-600 bg-red-100 rounded-full'
    };

    return statusClasses[status] || 'px-2 py-1 text-gray-600 bg-gray-100 rounded-full';
  }

  addOrganization() {
    this.router.navigate(['/add-organizations']);
  }

  editOrganization(org: Organization) {
    this.router.navigate(['/organizations', org.id, 'edit']);
  }

  deleteOrganization(id: number) {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.organizationService.remove(id).subscribe({
        next: () => {
          this.loadOrganizations();
        },
        error: (error) => {
          console.error('Error deleting organization:', error);
        }
      });
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}