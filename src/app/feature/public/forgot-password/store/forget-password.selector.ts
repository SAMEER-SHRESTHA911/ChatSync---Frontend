import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ForgetPasswordState } from './forget-password.state';

export const selectForgetPasswordState = createFeatureSelector<ForgetPasswordState>('forgetPassword');

export const selectLoading = createSelector(
  selectForgetPasswordState,
  (state: ForgetPasswordState) => state.loading
);

export const selectSuccess = createSelector(
  selectForgetPasswordState,
  (state: ForgetPasswordState) => state.success
);

export const selectError = createSelector(
  selectForgetPasswordState,
  (state: ForgetPasswordState) => state.error
);
