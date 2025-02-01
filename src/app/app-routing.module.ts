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
import { ProductsComponent } from './features/products/components/products/products.component';
import { CategoriesComponent } from './features/categories/components/categories/categories.component';
import { BlogsComponent } from './features/blogs/components/blogs/blogs.component';
import { ContactComponent } from './features/contact/components/contact/contact.component';
import { AboutUsComponent } from './features/about-us/components/about-us/about-us.component';
import { RegisterComponent } from './features/auth/componets/register/register.component';
import { ProfileComponent } from './features/auth/componets/profile/profile.component';

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
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'blogs',
        component: BlogsComponent,
      }
      ,
      {
        path: 'contact-us',
        component: ContactComponent,
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
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