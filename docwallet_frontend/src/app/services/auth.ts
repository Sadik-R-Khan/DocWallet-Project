import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";


export interface AuthRequest{
  email: string;
  password: string;
}
export interface AuthResponse{
  token:string;
}

@Injectable({
  providedIn:'root'
})

export class AuthService{
  private baseUrl ='http://localhost:8080/api/auth';
  private tokenKey ='jwt_token';

  constructor(private http:HttpClient, private router: Router){}
  
  register(credentials: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, credentials).pipe(
      tap((response:AuthResponse) =>{
        this.saveToken(response.token);
      })
    );
  }

  login(credentials:AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response:AuthResponse) =>{
        this.saveToken(response.token);
      })
    );
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean{
    return !!this.getToken(); //true if token exists else false
  }
}
