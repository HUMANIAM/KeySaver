/**
 * Passphrase input step component - shared between LoginForm and PassphraseModal
 */

import { useState } from 'react';

interface PassphraseStepProps {
  passphrase: string;
  onPassphraseChange: (passphrase: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string;
  title?: string;
  isStandalone?: boolean; // When true, renders with full page layout
  isNewUser?: boolean; // When true, shows confirmation field and validation
  confirmPassphrase?: string;
  onConfirmPassphraseChange?: (confirmPassphrase: string) => void;
}

export function PassphraseStep({ 
  passphrase, 
  onPassphraseChange, 
  onSubmit, 
  loading = false,
  error,
  title = "Enter Passphrase",
  isStandalone = false,
  isNewUser = false,
  confirmPassphrase = '',
  onConfirmPassphraseChange
}: PassphraseStepProps) {
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirmPassphrase, setShowConfirmPassphrase] = useState(false);

  // Validation for new users
  const isPassphraseTooShort = isNewUser && passphrase.length > 0 && passphrase.length < 14;
  const doPassphrasesMatch = !isNewUser || passphrase === confirmPassphrase;
  const isFormValid = passphrase.length >= (isNewUser ? 14 : 1) && doPassphrasesMatch;

  const formContent = (
    <>
      {isStandalone && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Passphrase Input */}
        <div>
          <div className="relative">
            <input
              type={showPassphrase ? "text" : "password"}
              placeholder={isNewUser ? "Create your passphrase (min 14 characters)" : "Enter your passphrase"}
              value={passphrase}
              onChange={(e) => onPassphraseChange(e.target.value)}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none ${
                isPassphraseTooShort 
                  ? 'border-red-300 focus:border-red-400' 
                  : 'border-gray-300 focus:border-gray-400'
              }`}
              autoComplete="new-password"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassphrase ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Validation Messages */}
          {isPassphraseTooShort && (
            <p className="text-xs text-red-600 mt-1">
              Passphrase must be at least 14 characters long
            </p>
          )}
          
          {isNewUser ? (
            <p className="text-xs text-gray-500 mt-2">
              Choose a memorable passphrase with at least 14 characters. Consider using a phrase with spaces, numbers, or symbols.
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              This passphrase decrypts your keys. It's never sent to the server.
            </p>
          )}
        </div>

        {/* Confirm Passphrase Input (New Users Only) */}
        {isNewUser && (
          <div>
            <div className="relative">
              <input
                type={showConfirmPassphrase ? "text" : "password"}
                placeholder="Confirm your passphrase"
                value={confirmPassphrase}
                onChange={(e) => onConfirmPassphraseChange?.(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none ${
                  confirmPassphrase.length > 0 && !doPassphrasesMatch
                    ? 'border-red-300 focus:border-red-400' 
                    : 'border-gray-300 focus:border-gray-400'
                }`}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassphrase(!showConfirmPassphrase)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassphrase ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {confirmPassphrase.length > 0 && !doPassphrasesMatch && (
              <p className="text-xs text-red-600 mt-1">
                Passphrases do not match
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium hover:bg-[#334155] transition-colors disabled:opacity-50"
        >
          {loading ? 'Validating...' : 'Continue'}
        </button>
      </form>
    </>
  );

  if (isStandalone) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] bg-white">
        <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
          <div className="space-y-6 mt-2">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return formContent;
}
