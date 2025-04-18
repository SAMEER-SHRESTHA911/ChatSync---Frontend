import { createAction, props } from "@ngrx/store";

export const sendPasswordResetLink = createAction
('[ForgetPassword] Send Password Reset Link',
  props<{email:string}>());

export const sendPasswordResetLinkSuccess = createAction
('[ForgetPassword] Send Password Reset Link Success');

export  const sendPasswordResetLinkFailure = createAction
('[ForgetPassword] Send Password Reset Link Failure',
  props<{error:any}>());

