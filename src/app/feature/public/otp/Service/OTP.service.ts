import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { baseUrl } from "@shared/constants/global.constants";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://zg0qm2qz-1595.inc1.devtunnels.ms/apigateway/user/Login/RequestOTP';

  constructor(private http: HttpClient, private router: Router) {}


  verifyOtp(otp: string): Observable<any> {
    console.log('nfvdhf')
    return this.http.post(`${baseUrl}/user/Login/RequestOTP`, { otp }).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to verify OTP'));
      })
    );
  }
}
