import { createAction, props } from '@ngrx/store';

export const verifyOtp = createAction('[OTP] Verify OTP',props<{ otp: string }>());
export const verifyOtpSuccess = createAction('[OTP] Verify OTP Success');
export const verifyOtpFailure = createAction('[OTP] Verify OTP Failure',props<{ error: any }>());
