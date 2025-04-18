import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../Service/OTP.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { verifyOtp, verifyOtpSuccess, verifyOtpFailure } from './OTP.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyOtp),
      switchMap(({ otp }) =>
        this.authService.verifyOtp(otp).pipe(
          map(() => verifyOtpSuccess()),
          catchError((error) => of(verifyOtpFailure({ error: error.message })))
        )
      )
    )
  );
}
