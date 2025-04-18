// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, map, Observable, throwError } from 'rxjs';
// import { API_URL_CONSTANTS } from '../constants/api-constants';

// const apiConstants = API_URL_CONSTANTS;

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private baseUrl = '';

//   constructor(private http: HttpClient, private router: Router) { }

//   setToken(token: string,): void {
//     localStorage.setItem('token', token);
//   }

//   setUserId(userId: string) {
//     localStorage.setItem('userId', userId)
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getUserId(): string | null {
//     return localStorage.getItem('userId');
//   }

//   isLoggedIn(): boolean {
//     const token = this.getToken();
//     return token ? true : false;
//   }

//   login(credentials: { email: string; password: string }): Observable<any> {
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//     return this.http.post(`${this.baseUrl}${API_URL_CONSTANTS.login}`, credentials, { headers }).pipe(

//       map((response: any) => {
//         const token = response.data.token;
//         const employeeId = response.data.employeeId;
//         this.setToken(token);
//         this.setUserId(employeeId);
//         return response;
//       }),
//       catchError(error => {
//         return throwError(() => new Error('Failed to login'));
//       })
//     );
//   }
// }
