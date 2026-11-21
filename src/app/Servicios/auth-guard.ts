import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { canAccessPage } from './roles';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!localStorage.getItem('cacao_token')) return router.createUrlTree(['/acceso'], { queryParams: { returnUrl: state.url } });
  const page = route.data['page'] as string | undefined;
  const role = localStorage.getItem('cacao_rol');
  if (page && !canAccessPage(page, role)) return router.createUrlTree(['/sin-permiso']);
  return true;
};
