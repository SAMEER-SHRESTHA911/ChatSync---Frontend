export interface ForgetPasswordState {
  loading: boolean;
  success: boolean;
  error: string;
}

export const initialForgetPasswordState: ForgetPasswordState = {
  loading: false,
  success: false,
  error: '',
};
