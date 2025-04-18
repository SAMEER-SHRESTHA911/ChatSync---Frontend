// forget-password.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ForgetPasswordActions from './forget-password.action';
import {  initialForgetPasswordState } from './forget-password.state';

export const forgetPasswordReducer = createReducer(
  initialForgetPasswordState,
  on(ForgetPasswordActions.sendPasswordResetLink, (state) => ({
    ...state,
    loading: true,
    success: false,
    error: '',
  })),
  on(ForgetPasswordActions.sendPasswordResetLinkSuccess, (state) => ({
    ...state,
    loading: false,
    success: true,
  })),
  on(ForgetPasswordActions.sendPasswordResetLinkFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);
