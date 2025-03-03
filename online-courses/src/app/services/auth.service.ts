import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private loggedIn = false;

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          this.loggedIn = true;
        }
      })
    );
  }

  login(credentials: UserLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          this.loggedIn = true;
        }
      })
    );
  }

  getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  logout(): void {
    this.clearToken();
    this.loggedIn = false;
  }
}