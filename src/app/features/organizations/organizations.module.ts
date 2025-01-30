import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationFormComponent } from './components/organization-form/organization-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationService } from './services/organizations.service';
import { SubscritionsComponent } from './components/subscritions/subscritions.component';



@NgModule({
  declarations: [
    OrganizationListComponent,
    OrganizationFormComponent,
    SubscritionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    OrganizationService  ],
})
export class OrganizationsModule { }
