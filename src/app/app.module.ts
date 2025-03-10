import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { UsersModule } from './features/users/users.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/hearder/hearder.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { OrganizationsModule } from './features/organizations/organizations.module';
import { PaymentsModule } from './features/payments/payments.module';
import { provideNgVibeDialog } from '@ng-vibe/dialog';
import { HomeModule } from './features/home/home.module';
import { ShopModule } from './features/shop/shop.module';
import { ContactModule } from './features/contact/contact.module';
import { ProductsModule } from './features/products/products.module';
import { CategoriesModule } from './features/categories/categories.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { AboutUsModule } from './features/about-us/about-us.module';
import { AdminModule } from './features/admin/admin.module';
import { ToastComponent } from './shared/components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    RouterModule,
    UsersModule,
    OrganizationsModule,
    PaymentsModule,
    ReactiveFormsModule,
    FormsModule,
    HomeModule,
    ShopModule,
    ContactModule,
    ProductsModule,
    CategoriesModule,
    AboutUsModule,
    BlogsModule,
    AdminModule,
    HttpClientModule,
    ToastComponent,
  ],
  providers: [provideNgVibeDialog()],
  bootstrap: [AppComponent],
})
export class AppModule {}
