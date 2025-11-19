/**
 * State management for LoginForm using reducer pattern
 */

export type Step = 'email' | 'passphrase' | 'sent';

export interface LoginFormState {
  step: Step;
  email: string;
  passphrase: string;
  error: string;
  loading: boolean;
  authToken: string;
  userValidator: string | null;
}

export type LoginFormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSPHRASE'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_AUTH_TOKEN'; payload: string }
  | { type: 'SET_USER_VALIDATOR'; payload: string | null }
  | { type: 'SET_EMAIL_SENT' }
  | { type: 'SET_PASSPHRASE_REQUIRED'; payload: { token: string; validator: string | null } }
  | { type: 'RESET_TO_EMAIL' };

export const initialState: LoginFormState = {
  step: 'email',
  email: '',
  passphrase: '',
  error: '',
  loading: false,
  authToken: '',
  userValidator: null,
};

export function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };

    case 'SET_PASSPHRASE':
      return { ...state, passphrase: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: '' };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };

    case 'SET_USER_VALIDATOR':
      return { ...state, userValidator: action.payload };

    case 'SET_EMAIL_SENT':
      return { ...state, step: 'sent', loading: false, error: '' };

    case 'SET_PASSPHRASE_REQUIRED':
      return {
        ...state,
        step: 'passphrase',
        authToken: action.payload.token,
        userValidator: action.payload.validator,
        loading: false,
        error: '',
      };

    case 'RESET_TO_EMAIL':
      return { ...state, step: 'email' };

    default:
      return state;
  }
}
