import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './OTP.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectOtpVerified = createSelector(
  selectAuthState,
  (state: AuthState) => state.otpVerified
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
