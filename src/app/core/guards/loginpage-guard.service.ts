import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginpageGuardService {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      // prevent navigate to login page if user is already logged in
      this.router.navigate(['/']);
      return false;
  }

    // not logged in so redirect to login page
    return true;
  }
}
