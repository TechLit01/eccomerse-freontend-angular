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
    HttpClientModule,
  
  ],
  providers: [
    provideNgVibeDialog(),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


