import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { FarmComponent } from './components/farm/farm.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { FarmadminComponent } from './admin/farmadmin/farmadmin.component';
import { BlogComponent } from './admin/blog/blog.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ErrorComponent } from './shared/error/error.component';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { GoogleCallbackComponent } from './auth/google-callback/google-callback.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './auth/update-password/update-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { PrivacyComponent } from './shared/privacy/privacy.component';
import { TermsComponent } from './shared/terms/terms.component';
import { TestimonialsComponent } from './shared/testimonials/testimonials.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Public pages
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'about', title: 'About', component: AboutComponent },
  { path: 'contact', title: 'Contact', component: ContactComponent },
  { path: 'services', title: 'Services', component: ServicesComponent },
  { path: 'farm', title: 'Our Farm', component: FarmComponent },
  { path: 'blogs', title: 'Blogs', component: BlogsComponent },
  { path: 'blogs/:id', title: 'Blog Detail', component: BlogDetailComponent },
  { path: 'privacy', title: 'Privacy Policy', component: PrivacyComponent },
  { path: 'terms', title: 'Terms of Service', component: TermsComponent },
  { path: 'testimonials', title: 'Testimonials', component: TestimonialsComponent },

  // Auth pages
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'forgot-password', title: 'Forgot Password', component: ForgotPasswordComponent },
  { path: 'reset-password', title: 'Reset Password', component: ResetPasswordComponent },
  { path: 'update-password', title: 'Update Password', component: UpdatePasswordComponent },
  { path: 'google-callback', title: 'Google Callback', component: GoogleCallbackComponent },

  // Admin dashboard with nested routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard', canActivate:[AuthGuard],
    children: [
      { path: 'farmadmin', title: 'Farm Admin', component: FarmadminComponent },
      { path: 'blog', title: 'Blog Admin', component: BlogComponent },
      { path: '', redirectTo: 'farmadmin', pathMatch: 'full' },
    ]
  },

  // Wildcard - must come last
  { path: '**', title: 'Page Not Found', component: ErrorComponent }
];
