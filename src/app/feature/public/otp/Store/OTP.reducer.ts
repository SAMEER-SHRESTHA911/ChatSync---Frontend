import { createReducer, on } from '@ngrx/store';
import { verifyOtpSuccess, verifyOtpFailure } from './OTP.actions';

export interface AuthState {
  otpVerified: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  otpVerified: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(verifyOtpSuccess, (state) => ({
    ...state,
    otpVerified: true,
    error: null
  })),
  on(verifyOtpFailure, (state, { error }) => ({
    ...state,
    otpVerified: false,
    error
  }))
);
