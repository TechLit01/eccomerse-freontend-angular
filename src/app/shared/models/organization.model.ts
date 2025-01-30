// src/app/shared/models/organization.model.ts

export enum SubscriptionPlan 
{
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  ENTERPRISE = 'ENTERPRISE',
}
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface Organization {
  id: number;
  name: string;
  address?: string;
  contact?: string;
  complementaryMessage?: string;
  stations?: any;
  bankDetails?: any;
  mpesaDetails?: any;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: number;
  organizationId: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  maxDevices: number;
  maxUsers: number;
  maxLocations: number;
  licenseKey: string;
  price: number;
  autoRenew: boolean;
}

export interface OrganizationCreateInput {
  name: string;
  address?: string;
  contact?: string;
  complementaryMessage?: string;
  stations?: any;
  bankDetails?: any;
  mpesaDetails?: any;
  subscriptionPlan?: SubscriptionPlan;
  maxDevices?: number;
  maxUsers?: number;
  maxLocations?: number;
  autoRenew?: boolean;
}

export interface OrganizationUpdateInput extends Partial<OrganizationCreateInput> {}