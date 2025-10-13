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
  { path: '', title: 'The Palace Farm - Smart Farming Solutions & Quality Products | Kenya', component: HomeComponent },
  { path: 'about', title: 'About The Palace Farm - Kenya\'s Premier Smart Farming Destination', component: AboutComponent },
  { path: 'contact', title: 'Contact The Palace Farm - Get in Touch | Kenya', component: ContactComponent },
  { path: 'services', title: 'Farm Services - Smart Farming Solutions | The Palace Farm Kenya', component: ServicesComponent },
  { path: 'farm', title: 'Visit Our Farm - Sustainable Agriculture & Modern Farming | Kenya', component: FarmComponent },
  { path: 'shop', title: 'Farm Shop - Quality Poultry, Garden Systems & Training | Kenya', component: ShopComponent },
  { path: 'blogs', title: 'Farming Blogs & Agriculture Tips | The Palace Farm Kenya', component: BlogsComponent },
  { path: 'blogs/:id', title: 'Blog Detail - Farming Insights | The Palace Farm', component: BlogDetailComponent },
  { path: 'privacy', title: 'Privacy Policy | The Palace Farm Kenya', component: PrivacyComponent },
  { path: 'terms', title: 'Terms of Service | The Palace Farm Kenya', component: TermsComponent },
  { path: 'testimonials', title: 'Customer Testimonials & Reviews | The Palace Farm Kenya', component: TestimonialsComponent },

  // (auth/admin routes removed)

  // Wildcard - must come last
  { path: '**', title: 'Page Not Found', component: ErrorComponent }
];
