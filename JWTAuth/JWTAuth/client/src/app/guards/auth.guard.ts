import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnacbar =inject(MatSnackBar);

  if(inject(AuthService).isLoggedIn()){
    return true;
  }

  matSnacbar.open('You must be logged into view this page', 'Ok', {
    duration:3000,
  });
  inject(Router).navigate(['/']);
  return false;
};
