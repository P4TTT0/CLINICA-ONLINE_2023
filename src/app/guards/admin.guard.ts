import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);

  await authService.reLogin();

  if (authService.rol == 'Admin') {
    return true; 
  } else {
    return false;
  }
};
