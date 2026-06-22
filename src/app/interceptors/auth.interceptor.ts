import { HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(AuthService).accessToken;

  req = req.clone({
    setHeaders: {
      Authorization: `Bear ${accessToken}`,
    },
  });

  return next(req);
}
