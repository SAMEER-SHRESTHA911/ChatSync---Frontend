import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authService = inject(AuthService);
  
  return true;
  // return authService.isLoggedIn() ? router.createUrlTree(['/', 'admin']) : true;
};

export const publicGuard: CanActivateFn = (route, state) => { 
  const router = inject(Router);
  // const authService = inject(AuthService);

  return true;
  // return authService.isLoggedIn() ? true : router.createUrlTree(['/', 'login']);
}
