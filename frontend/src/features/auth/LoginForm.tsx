import { useRef, forwardRef, useImperativeHandle, useReducer, useEffect } from 'react';
import { setToken } from '../../services/api';
import { ERROR_MESSAGES } from '../../shared/constants';

// Service layer
import * as authService from './auth.service';

// Utilities
import {
  isValidEmail,
  extractTokenFromURL,
  clearTokenFromURL,
  mapErrorMessage,
} from './auth.utils';

// State management
import { loginFormReducer, initialState } from './loginForm.state';

// Components
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { EmailStep } from './components/EmailStep';
import { SentStep } from './components/SentStep';
import { PassphraseStep } from './components/PassphraseStep';

// Types
interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export interface LoginFormRef {
  focusEmail: () => void;
}

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(
  ({ onLoginSuccess }, ref) => {
    const emailInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useReducer(loginFormReducer, initialState);

    // Expose ref API
    useImperativeHandle(ref, () => ({
      focusEmail: () => emailInputRef.current?.focus(),
    }));

    // Check for token in URL on mount
    useEffect(() => {
      const token = extractTokenFromURL();
      if (token) {
        handleURLToken(token);
        clearTokenFromURL();
      }
    }, []);

    // Handlers

    async function handleURLToken(token: string): Promise<void> {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const result = await authService.verifyEmailToken(token);
        setToken(result.token);
        dispatch({
          type: 'SET_PASSPHRASE_REQUIRED',
          payload: {
            token: result.token,
            validator: result.user.passphrase_validator || null,
          },
        });
      } catch (error) {
        const errorMessage = mapErrorMessage(error) || 'Invalid or expired token';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    async function submitEmail(e: React.FormEvent): Promise<void> {
      e.preventDefault();

      if (!isValidEmail(state.email)) {
        dispatch({ type: 'SET_ERROR', payload: 'Please enter a valid email' });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        const result = await authService.sendLoginLink(state.email);

        if (result.verified && result.token) {
          // Existing user - go to passphrase
          setToken(result.token);
          dispatch({
            type: 'SET_PASSPHRASE_REQUIRED',
            payload: {
              token: result.token,
              validator: result.user?.passphrase_validator || null,
            },
          });
        } else {
          // New user - show email sent
          dispatch({ type: 'SET_EMAIL_SENT' });
        }
      } catch (error) {
        const errorMessage = mapErrorMessage(error) || 'Failed to send verification link';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    async function submitPassphrase(e: React.FormEvent): Promise<void> {
      e.preventDefault();

      if (!state.passphrase) {
        dispatch({ type: 'SET_ERROR', payload: 'Passphrase is required' });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      try {
        if (state.userValidator) {
          // Existing user - validate passphrase
          await authService.loginExistingUser(
            state.passphrase,
            state.authToken,
            state.userValidator
          );
        } else {
          // New user - create validator
          await authService.loginNewUser(state.passphrase, state.authToken);
        }

        onLoginSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error && error.message === 'Invalid passphrase'
            ? ERROR_MESSAGES.INVALID_PASSPHRASE
            : mapErrorMessage(error) || 'An error occurred';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    function handleEmailChange(email: string): void {
      dispatch({ type: 'SET_EMAIL', payload: email });
    }

    function handlePassphraseChange(passphrase: string): void {
      dispatch({ type: 'SET_PASSPHRASE', payload: passphrase });
    }

    function handleTryDifferentEmail(): void {
      dispatch({ type: 'RESET_TO_EMAIL' });
    }

    // Derived state
    const isEmailStep = state.step === 'email';
    const isSentStep = state.step === 'sent';
    const isPassphraseStep = state.step === 'passphrase';
    const title = isPassphraseStep ? 'Enter Passphrase' : 'Login to KeySaver';

    // Render loading state
    if (state.loading) {
      return <LoadingSpinner />;
    }

    // Render main form
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] bg-white">
        <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
          <div className="space-y-6 mt-2">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

            {!isPassphraseStep && <ErrorMessage message={state.error} />}

            {isEmailStep && (
              <EmailStep
                ref={emailInputRef}
                email={state.email}
                onEmailChange={handleEmailChange}
                onSubmit={submitEmail}
              />
            )}

            {isSentStep && <SentStep onTryDifferentEmail={handleTryDifferentEmail} />}

            {isPassphraseStep && (
              <PassphraseStep
                passphrase={state.passphrase}
                onPassphraseChange={handlePassphraseChange}
                onSubmit={submitPassphrase}
                loading={state.loading}
                error={state.error}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

LoginForm.displayName = 'LoginForm';

export default LoginForm;
