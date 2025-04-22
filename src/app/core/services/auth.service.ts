import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from 'rxjs';
import { API_URL_CONSTANTS } from '../constants/api-constants';
import { baseUrl } from '../../environment';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '../models/interface';

const {
    login,
    register,
    auth
} = API_URL_CONSTANTS;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    private logoutSubject = new Subject<void>();

    constructor(private http: HttpClient, private router: Router) { }

    setToken(token: string,): void {
        localStorage.setItem('token', token);
        this.isAuthenticatedSubject.next(true);
    }

    setUserId(userId: number) {
        localStorage.setItem('userId', userId.toString())
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    clearToken(): void {
        localStorage.removeItem('token');
        this.logoutSubject.next();
        this.router.navigate(['/login']);
    }

    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    isLoggedIn(): boolean {
        return this.hasToken();
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    login(credentials: LoginPayload): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<LoginResponse>(`${baseUrl}/${auth}/${login}`, credentials, { headers }).pipe(

            tap((response: LoginResponse) => {
                if (response.token) {
                    this.setToken(response.token);
                    this.setUserId(response.userId);
                }
            }),
            catchError(error => {
                return throwError(() => new Error('Failed to login'));
            })
        );
    }

    register(registerData: RegisterPayload): Observable<RegisterResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<RegisterResponse>(`${baseUrl}/${auth}/${register}`, registerData, { headers }).pipe(
            catchError(error => {
                return throwError(() => new Error(error.error?.message || 'Failed to register'));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login'])
    }

    onLogout(): Observable<void> {
        return this.logoutSubject.asObservable();
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }
}
