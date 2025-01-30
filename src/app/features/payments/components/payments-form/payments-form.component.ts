import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { OrganizationService, CreatePaymentDto } from '../../../organizations/services/organizations.service';


export enum TransactionType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  MPESA = 'MPESA',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT = 'CREDIT'
}
@Component({
  selector: 'app-payments-form',
  standalone: false,
  
  templateUrl: './payments-form.component.html',
  styleUrl: './payments-form.component.scss'
})
export class PaymentsFormComponent extends ModalComponent implements OnInit {
  paymentForm: FormGroup;
  isLoading = false;
  isUpdateMode = false;
  paymentIdToUpdate: number | null = null;
  orgIdToMakePaymentsFor: number | null = null;
  
  // Expose enums to template
  transactionTypes = Object.values(TransactionType);
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService
  ) {
    super();
    this.orgIdToMakePaymentsFor = this.dialogRemoteControl?.payload;
    // this.isUpdateMode = !!this.paymentIdToUpdate;

    this.paymentForm = this.fb.group({
      transactionType: [TransactionType.SUBSCRIPTION, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      method: [PaymentMethod.BANK_TRANSFER, Validators.required],
      transactionCode: [''],
      remarks: [''],
      paidBy: ['', Validators.required],
      paidTo: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.isUpdateMode && this.paymentIdToUpdate) {
      this.loadPaymentDetails();
    }
  }

  async loadPaymentDetails() {
    try {
      this.isLoading = true;
      // Implement loading logic here when you have the endpoint
    } catch (error) {
      console.error('Error loading payment details:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.paymentForm.invalid || this.isLoading) return;

    try {
      this.isLoading = true;
      const formData = this.paymentForm.value;

      if (this.isUpdateMode && this.paymentIdToUpdate) {
        // Implement update logic when you have the endpoint
      } else {
        await firstValueFrom(this.organizationService.createPayment(this.orgIdToMakePaymentsFor!, formData));
      }

      this.close(true);
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      this.isLoading = false;
    }
  }
}