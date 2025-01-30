import { Component, OnInit } from '@angular/core';
import { OrganizationService, PaymentTransaction } from '../../../organizations/services/organizations.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PaymentsFormComponent } from '../payments-form/payments-form.component';
import { AppearanceAnimation, DialogRemoteControl, DisappearanceAnimation } from '@ng-vibe/dialog';
export enum TransactionType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  EXPENSE = 'EXPENSE',
  Refund = 'Refund',
  Chargeback = 'Chargeback',
  Other = 'Other'
}

export enum PaymentMethod {
  CASH = 'CASH',
  MPESA = 'MPESA',
  BANK_TRANSFER = 'BANK_TRANSFER',
  Other = 'Other'
}

@Component({
  selector: 'app-payments-list',
  standalone: false,
  
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss'
})
export class PaymentsListComponent implements OnInit {

  private addDialog: DialogRemoteControl = new DialogRemoteControl(PaymentsFormComponent);
  
  private updateDialog: DialogRemoteControl = new DialogRemoteControl(PaymentsFormComponent);
  payments: PaymentTransaction[] = [];
  paymentsCopy: PaymentTransaction[] = [];
  loading = false;
  error: string | null = null;
  summary: any;
  TransactionType = TransactionType;
  PaymentMethod = PaymentMethod;

  filters = {
    transactionType: '',
    method: '',
    startDate: '',
    endDate: ''
  };

  private filterSubject = new Subject<void>();

  constructor(private organizationService: OrganizationService) {
    this.filterSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadPayments();
      });
  }

  ngOnInit() {
    this.loadPayments();
  }

  onFilterChange() {
    this.filterSubject.next();
  }

  loadPayments() {
    this.loading = true;
    this.error = null;

    const params: any = {};
    if (this.filters.transactionType) params.transactionType = this.filters.transactionType;
    if (this.filters.method) params.method = this.filters.method;
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;

    this.organizationService.getPaymentTransactions(params)
      .subscribe({
        next: (response) => {
          this.payments = response.payments;
          this.summary = response.summary;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }

 
  openDialogAddModal(optionalPayload?: any) {
    this.addDialog.options = {
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT_ROTATE,
    };
    this.addDialog.openDialog(optionalPayload).subscribe((resp) => {
      if (resp) {
        this.loadPayments();
      }
    });
  }

  openDialogUpdateModal(optionalPayload?: any) {
    this.updateDialog.options = {
      showOverlay: true,
      height: '96vh',
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT_ROTATE,
    };
    this.updateDialog.openDialog(optionalPayload).subscribe((resp) => {
      if (resp) {
        this.loadPayments();
      }
    });
  }
}