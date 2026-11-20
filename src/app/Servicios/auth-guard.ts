import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
  if (localStorage.getItem('cacao_token')) return true;
  return inject(Router).createUrlTree(['/acceso'], { queryParams: { returnUrl: state.url } });
};
