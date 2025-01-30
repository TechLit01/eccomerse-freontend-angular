import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/organizations.service';
import { BehaviorSubject } from 'rxjs';
import { Subscription, SubscriptionStatus } from '../../../../shared/types/subscription.types';
import { DialogRemoteControl, AppearanceAnimation, DisappearanceAnimation } from '@ng-vibe/dialog';
import { PaymentsFormComponent } from '../../../payments/components/payments-form/payments-form.component';

@Component({
  selector: 'app-subscritions',
  standalone: false,
  templateUrl: './subscritions.component.html',
  styleUrl: './subscritions.component.scss'
})
export class SubscritionsComponent implements OnInit {
    private addDialog: DialogRemoteControl = new DialogRemoteControl(PaymentsFormComponent);
     
 
  subscriptions$ = new BehaviorSubject<Subscription[]>([]);
  allSubscriptions: Subscription[] = []; // Store all subscriptions
  loading = false;
  error: string | null = null;
  selectedStatus: string = '';
  searchQuery: string = '';
  statusOptions = ['ALL', ...Object.values(SubscriptionStatus)];

  constructor(private organizationService: OrganizationService) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    this.error = null;
    
    this.organizationService.getAllSubscriptions(
      this.selectedStatus === 'ALL' ? undefined : this.selectedStatus as any
    ).subscribe({
      next: (data: any) => {
        this.allSubscriptions = data; // Store the complete data
        this.subscriptions$.next(data); // Initialize with all data
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  filterSubscriptions() {
    // First filter by status
    let filtered = [...this.allSubscriptions];
    if (this.selectedStatus && this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(sub => sub.status === this.selectedStatus);
    }

    // Then filter by search query if it exists
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(sub => 
        sub.organization.name.toLowerCase().includes(query) ||
        sub.licenseKey.toLowerCase().includes(query)
      );
    }

    this.subscriptions$.next(filtered);
  }

  onSearch() {
    this.filterSubscriptions();
  }

  onStatusChange() {
    this.filterSubscriptions();
  }

  async updateStatus(subscription: Subscription, newStatus: any) {
    try {
      await this.organizationService.updateSubscriptionStatus(
        subscription.organization.id,
        newStatus
      ).toPromise();
      
      this.loadSubscriptions(); // Reload all data after update
    } catch (error:any) {
      this.error = error.message;
    }
  }

  getStatusColor(status: SubscriptionStatus): string {
    const colors = {
      [SubscriptionStatus.ACTIVE]: 'text-green-500',
      [SubscriptionStatus.EXPIRED]: 'text-red-500',
      [SubscriptionStatus.SUSPENDED]: 'text-orange-500',
      [SubscriptionStatus.TRIAL]: 'text-blue-500'
    };
    return colors[status] || 'text-gray-500';
  }

  openDialogAddModal(optionalPayload?: any) {
    this.addDialog.options = {
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT_ROTATE,
    };
    this.addDialog.openDialog(optionalPayload).subscribe((resp) => {
      if (resp) {
        // this.loadPayments();
      }
    });
  }

 

  

  

  
}