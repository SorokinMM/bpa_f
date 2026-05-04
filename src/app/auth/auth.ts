import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);
  url = 'http://localhost:8080/bpa/v1/auth/';

  login(payload: { username: string; password: string }) {
    console.log('Start login');
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    var result = this.http.post(`${this.url}authenticate`, formData);
    console.log('result', result);
    return result;
  }
}
