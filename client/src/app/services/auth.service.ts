import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginStatus: boolean = false;
  private token: string = '';
  constructor(private http: HttpClient) {}

  // can also return a observable if want to do further error handling in components.
  register(user: any): void {
    this.http.post('register api url', user).subscribe((data) => {
      // token from callback function above
      const token = 'get from api';
      this.token = token;
      this.loginStatus = true;
      localStorage.setItem('ACCESS_TOKEN', token);
    });
  }
  // possiblely change to USER interface
  login(user: any): void {
    this.http.post('login api url', user).subscribe((data) => {
      // token from callback function above
      const token = 'get from api';
      this.token = token;
      this.loginStatus = true;
      localStorage.setItem('ACCESS_TOKEN', token);
    });
  }

  logout(): void {
    // this.loginStatus = false;
    // this.token = '';
    localStorage.removeItem('ACCESS_TOKEN');
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('ACCESS_TOKEN') || '';
    }
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.loginStatus;
  }
}
