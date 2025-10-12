import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { FarmComponent } from './components/farm/farm.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { ShopComponent } from './components/shop/shop.component';
// Admin components removed (site is frontend-only)
import { ErrorComponent } from './shared/error/error.component';

// Auth components removed (frontend-only site)
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
  { path: 'shop', title: 'Farm Shop', component: ShopComponent },
  { path: 'blogs', title: 'Blogs', component: BlogsComponent },
  { path: 'blogs/:id', title: 'Blog Detail', component: BlogDetailComponent },
  { path: 'privacy', title: 'Privacy Policy', component: PrivacyComponent },
  { path: 'terms', title: 'Terms of Service', component: TermsComponent },
  { path: 'testimonials', title: 'Testimonials', component: TestimonialsComponent },

  // (auth/admin routes removed)

  // Wildcard - must come last
  { path: '**', title: 'Page Not Found', component: ErrorComponent }
];
