// types/subscription.types.ts
export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    SUSPENDED = 'SUSPENDED',
    TRIAL = 'TRIAL'
  }
  
  export enum SubscriptionPlan {
    BASIC = 'BASIC',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM',
    ENTERPRISE = 'ENTERPRISE'
  }
  
  export interface Device {
    id: number;
    deviceName: string;
    lastActive: string;
  }
  
  export interface OrganizationCount {
    users: number;
    locations: number;
  }
  
  export interface OrganizationInfo {
    id: number;
    name: string;
    address: string;
    contact: string;
    _count: OrganizationCount;
  }
  
  export interface Subscription {
    id: number;
    organization: OrganizationInfo;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    maxDevices: number;
    maxUsers: number;
    maxLocations: number;
    licenseKey: string;
    price: number;
    devices: Device[];
    daysRemaining: number;
    isExpired: boolean;
    activeDevices: number;
  }
  
  export interface SubscriptionResponse {
    data: Subscription[];
    message: string;
    status: number;
  }
  
  export interface StatusUpdateResponse {
    success: boolean;
    message: string;
    organizationName: string;
    newStatus: SubscriptionStatus;
    previousStatus: SubscriptionStatus;
    updateTime: string;
    remarks?: string;
  }