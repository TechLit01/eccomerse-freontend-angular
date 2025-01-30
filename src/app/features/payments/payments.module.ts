import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsFormComponent } from './components/payments-form/payments-form.component';
import { PaymentsListComponent } from './components/payments-list/payments-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PaymentsFormComponent,
    PaymentsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PaymentsModule { }
