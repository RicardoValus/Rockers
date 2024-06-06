import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../models/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.getLoggedUserThroughLocalStorage() !== null;
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
    return isLoggedIn;
  }
}
