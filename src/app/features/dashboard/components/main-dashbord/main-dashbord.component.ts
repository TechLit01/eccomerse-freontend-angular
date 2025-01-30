// main-dashboard.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-dashbord',
  standalone: false,
  templateUrl: './main-dashbord.component.html',
  styleUrl: './main-dashbord.component.scss'
})
export class MainDashbordComponent implements OnInit {
  currentDate = new Date();
  currentUser = 'shaphankirui';
  
  // Dummy data
  organizationStats = {
    totalOrganizations: 156,
    activeSubscriptions: 142,
    trialSubscriptions: 8,
    expiredSubscriptions: 6,
    totalRevenue: 450000,
    activeUsers: 1250,
    recentActivations: 12
  };

  recentActivities = [
    { type: 'subscription_activated', org: 'Tech Solutions Ltd', time: '2 hours ago' },
    { type: 'subscription_expired', org: 'Global Innovations', time: '5 hours ago' },
    { type: 'new_organization', org: 'StartUp Hub', time: '1 day ago' },
    { type: 'payment_received', org: 'Digital Systems Inc', time: '2 days ago' },
  ];

  subscriptionsByPlan = [
    { plan: 'BASIC', count: 45, percentage: 28 },
    { plan: 'STANDARD', count: 65, percentage: 42 },
    { plan: 'PREMIUM', count: 35, percentage: 22 },
    { plan: 'ENTERPRISE', count: 11, percentage: 8 },
  ];

  upcomingRenewals = [
    { org: 'Tech Solutions Ltd', plan: 'PREMIUM', daysLeft: 5 },
    { org: 'Digital Systems Inc', plan: 'ENTERPRISE', daysLeft: 7 },
    { org: 'StartUp Hub', plan: 'BASIC', daysLeft: 10 },
  ];

  ngOnInit() {
    // You can add any initialization logic here
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      subscription_activated: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      subscription_expired: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      new_organization: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      payment_received: 'M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }

  getActivityColor(type: string): string {
    const colors: { [key: string]: string } = {
      subscription_activated: 'text-green-500',
      subscription_expired: 'text-red-500',
      new_organization: 'text-blue-500',
      payment_received: 'text-purple-500'
    };
    return colors[type] || 'text-gray-500';
  }
}