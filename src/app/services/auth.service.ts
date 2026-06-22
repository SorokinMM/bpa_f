import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../interfaces/auth.interface';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { getLocaleTimeFormat } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  url = 'http://localhost:8080/bpa/v1/auth/';
  cookieService = inject(CookieService);

  accessToken: string | null = null;

  get isAuth() {
    console.log('isAuth: ' + !!this.accessToken);
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    return this.http.post<TokenResponse>(`${this.url}authenticate`, formData)
      .pipe(
        tap((val) => {
          this.accessToken = val.jwt;
          this.cookieService.set('accessToken', this.accessToken);
        }),
      );
  }

  register(payload: { username: string, password: string, repeatPassword: string }) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    formData.append('repeatPassword', payload.repeatPassword);

    return this.http.post<TokenResponse>(`${this.url}register`, formData)
      .pipe(
        catchError((error) => {
          return throwError(error.error.message);
        }),
        tap((val) => {
          this.accessToken = val.jwt;
        })
      )
  }
}
