import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] || [];
    // During prerender (SSR) avoid making async HTTP calls. Deny access to protected routes
    // so prerender won't attempt to fetch user data.
    if (!isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
      return false;
    }

    // In the browser, perform the normal check using token/role
    const role = this.authService.getUserRole();
    if (role && expectedRoles.includes(role)) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
