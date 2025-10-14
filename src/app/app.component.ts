import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { ToastComponent } from './shared/toast/toast.component';
import { SEOService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,FooterComponent,HeaderComponent,CartComponent,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'The Palace Farm - Kenya\'s Premier Smart Farming Hub';

  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    // SEO service automatically handles route-based metadata updates
    // Initial page load SEO is handled by the service constructor
  }
}



