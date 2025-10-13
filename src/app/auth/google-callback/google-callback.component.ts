import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  styleUrls: ['./google-callback.component.scss']
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const returnUrl = params['returnUrl']?.trim() || '/dashboard';

      if (token) {
        console.log('✅ Google token received:', token);

        if (isPlatformBrowser(this.platformId)) {
          try {
            localStorage.setItem('access_token', token);
            try { this.toast.success('✅ Login successful! Redirecting...'); } catch (e) {}
          } catch (e) {
            console.error('❌ Error saving token to localStorage:', e);
            try { this.toast.error('⚠️ Unable to store login session.'); } catch (e) {}
          }
        } else {
          console.warn('⚠️ localStorage not available, skipping token storage.');
        }

        setTimeout(() => {
          console.log(`🔁 Redirecting to ${returnUrl}...`);
          this.router.navigateByUrl(returnUrl);
        }, 100);
      } else {
        if (isPlatformBrowser(this.platformId)) {
          try { this.toast.error('❌ No token found. Login failed.'); } catch (e) {}
        }
        this.router.navigate(['/login']);
      }
    }, error => {
      console.error('❌ Error reading query params:', error);
      if (isPlatformBrowser(this.platformId)) {
        try { this.toast.error('❌ Unexpected error occurred during login.'); } catch (e) {}
      }
      this.router.navigate(['/login']);
    });
  }
}
