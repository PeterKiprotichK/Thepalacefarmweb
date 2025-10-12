import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  styleUrls: ['./google-callback.component.scss']
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
            alert('✅ Login successful! Redirecting...');
          } catch (e) {
            console.error('❌ Error saving token to localStorage:', e);
            alert('⚠️ Unable to store login session.');
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
          alert('❌ No token found. Login failed.');
        }
        this.router.navigate(['/login']);
      }
    }, error => {
      console.error('❌ Error reading query params:', error);
      if (isPlatformBrowser(this.platformId)) {
        alert('❌ Unexpected error occurred during login.');
      }
      this.router.navigate(['/login']);
    });
  }
}
