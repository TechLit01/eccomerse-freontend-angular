import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './features/auth/componets/login/login.component';
import { OrganizationListComponent } from './features/organizations/components/organization-list/organization-list.component';
import { OrganizationFormComponent } from './features/organizations/components/organization-form/organization-form.component';
import { SubscritionsComponent } from './features/organizations/components/subscritions/subscritions.component';
import { MainDashbordComponent } from './features/dashboard/components/main-dashbord/main-dashbord.component';
import { PaymentsListComponent } from './features/payments/components/payments-list/payments-list.component';
import { HomeComponent } from './features/home/components/home/home.component';

// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
       component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'organizations',
        component: OrganizationListComponent,
      },
      {
        path: 'subscriptions',
        component: SubscritionsComponent,
      },
      {
        path: 'organizations/:id/edit',
        component: OrganizationFormComponent,
      }
      ,
      {
        path: 'add-organizations',
        component: OrganizationFormComponent,
      }
      ,
      {
        path: 'payments',
        component: PaymentsListComponent,
      }

      // ... other routes
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module')
      .then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }