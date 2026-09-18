import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../interfaces/auth.interface';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  url = 'http://localhost:8080/bpa/v1/auth/';
  cookieService = inject(CookieService);

  accessToken: string | null = this.cookieService.get('accessToken') || null;

  get isAuth() {
    if (!this.accessToken) {
      console.log('isAuth: false (no token)');
      return false;
    }

    const isExpired = this.isTokenExpired(this.accessToken);
    if (isExpired) {
      console.log('isAuth: false (token expired)');
      this.accessToken = null;
      this.cookieService.delete('accessToken');
      return false;
    }

    console.log('isAuth: true');
    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;

      if (!exp)
        return false;

      console.log('Expire date:' + exp * 1000 + ', now: ' + Date.now());

      return Date.now() >= exp * 1000;
    } catch {
      return false;
    }
  }

  login(payload: { username: string; password: string }) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);

    this.cookieService.delete('accessToken');
    this.accessToken = null;

    return this.http.post<TokenResponse>(`${this.url}authenticate`, formData).pipe(
      tap((val) => {
        this.accessToken = val.jwt;
        this.cookieService.set('accessToken', this.accessToken);
      }),
    );
  }

  register(payload: { username: string; password: string; repeatPassword: string }) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    formData.append('repeatPassword', payload.repeatPassword);

    this.cookieService.delete('accessToken');
    this.accessToken = null;

    return this.http.post<TokenResponse>(`${this.url}register`, formData).pipe(
      catchError((error) => {
        return throwError(error.error?.message || 'Registration failed');
      }),
      tap((val) => {
        this.accessToken = val.jwt;
      }),
    );
  }
}
