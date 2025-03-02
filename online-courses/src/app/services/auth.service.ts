import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private loggedIn = false;
  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.loggedIn; // Replace with actual logic to check authentication status
  }

  register(user: User): Observable<any> {
    this.loggedIn=true;
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: UserLogin): Observable<any> {
    this.loggedIn=true;
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
  logout() {
    this.loggedIn = false; 
  }
}