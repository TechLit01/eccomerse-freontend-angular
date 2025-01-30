import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Organization, OrganizationCreateInput, OrganizationUpdateInput, SubscriptionStatus } from '../../../shared/models/organization.model';
import { SubscriptionResponse, StatusUpdateResponse, Subscription } from '../../../shared/types/subscription.types';

export interface PaymentTransaction {
  id: number;
  transactionType: string;
  organizationId?: number;
  amount: number;
  method: string;
  status: string;
  transactionCode?: string;
  remarks?: string;
  paidBy: string;
  paidTo: string;
  description: string;
  receiptUrl?: string;
  createdAt: Date;
  organization?: {
    name: string;
    subscription?: {
      plan: string;
      status: string;
    };
  };
}

export interface CreatePaymentDto {
  transactionType: string;
  amount: number;
  method: string;
  transactionCode?: string;
  remarks?: string;
  paidBy: string;
  paidTo: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/organization`;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  findAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  findOne(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(organization: OrganizationCreateInput): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, organization, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, organization: OrganizationUpdateInput): Observable<Organization> {
    return this.http.patch<Organization>(`${this.apiUrl}/${id}`, organization, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllSubscriptions(status?: SubscriptionStatus): Observable<Subscription[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
  
    return this.http.get<Subscription[]>(
      `${this.apiUrl}/subscriptions`,
      {
        headers: this.getHeaders(),
        params
      }
    ).pipe(
      // Remove the map operator since the response is already in the correct format
      // map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateSubscriptionStatus(
    organizationId: number, 
    status: SubscriptionStatus, 
    remarks?: string
  ): Observable<StatusUpdateResponse> {
    return this.http.patch<StatusUpdateResponse>(
      `${this.apiUrl}/${organizationId}/subscription-status`,
      { status, remarks },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrganizationStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/stats`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOrganizationRevenue(id: number, startDate: Date, endDate: Date): Observable<any> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    return this.http.get<any>(`${this.apiUrl}/${id}/revenue`, { headers: this.getHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    console.error('API Error:', error);
    return throwError(() => ({
      timestamp: new Date(),
      status: error.status,
      error: error.error,
      message: errorMessage,
      path: error.url
    }));
  }

  getPaymentTransactions(params?: {
    organizationId?: number;
    transactionType?: string;
    startDate?: string;
    endDate?: string;
    method?: string;
  }): Observable<{ payments: PaymentTransaction[], summary: any }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) httpParams = httpParams.set(key, value.toString());
      });
    }

    return this.http.get<{ payments: PaymentTransaction[], summary: any }>(
      `${this.apiUrl}/payments`,
      { headers: this.getHeaders(), params: httpParams }
    ).pipe(catchError(this.handleError));
  }

  createPayment(organizationId: number, payment: CreatePaymentDto): Observable<PaymentTransaction> {
    return this.http.post<PaymentTransaction>(
      `${this.apiUrl}/${organizationId}/payments`,
      payment,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }
}