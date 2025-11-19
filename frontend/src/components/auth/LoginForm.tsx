import { X } from "lucide-react";
import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { sendAuthLink, verifyToken as verifyTokenAPI, setToken, setValidator } from "../../services/api";
import { setPassphrase, encrypt, decrypt } from "../../utils/encryption";
import { PASSPHRASE_VALIDATION_STRING, ERROR_MESSAGES } from "../../constants";

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export interface LoginFormRef {
  focusEmail: () => void;
}

type Step = 'email' | 'passphrase' | 'sent';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(({ onClose, onLoginSuccess }, ref) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [passphrase, setPassphraseValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [userValidator, setUserValidator] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    focusEmail: () => emailInputRef.current?.focus()
  }));

  // Check for token in URL (verification or login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      handleTokenFromURL(token);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleTokenFromURL = async (token: string) => {
    setLoading(true);
    try {
      const result = await verifyTokenAPI(token);
      setAuthToken(result.token);
      setUserValidator(result.user.passphrase_validator || null);
      setStep('passphrase');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired token');
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await sendAuthLink(email);
      if (result.verified) {
        // User already verified - go directly to passphrase
        setAuthToken(result.token);
        // Fetch user info to get validator
        setToken(result.token);
        setUserValidator(result.user?.passphrase_validator || null);
        setStep('passphrase');
      } else {
        // New user - show email sent message
        setStep('sent');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification link');
    }
    setLoading(false);
  };

  const handlePassphraseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) {
      setError("Passphrase is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Set passphrase in memory for encryption
      setPassphrase(passphrase);
      setToken(authToken);
      
      if (userValidator) {
        // Existing user - validate passphrase
        try {
          const decrypted = decrypt(userValidator);
          if (decrypted !== PASSPHRASE_VALIDATION_STRING) {
            setError(ERROR_MESSAGES.INVALID_PASSPHRASE);
            setLoading(false);
            return;
          }
        } catch {
          setError(ERROR_MESSAGES.INVALID_PASSPHRASE);
          setLoading(false);
          return;
        }
      } else {
        // First time user - set validator
        const validationTest = encrypt(PASSPHRASE_VALIDATION_STRING);
        await setValidator(validationTest);
      }
      
      onLoginSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] bg-white">
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close">
          <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        </button>

        <div className="space-y-6 mt-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'passphrase' ? 'Enter Passphrase' : 'Login to KeySaver'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                autoComplete="off"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium hover:bg-[#334155] transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {step === 'sent' && (
            <div className="text-center space-y-4">
              <p className="text-gray-700">✉️ Check your email for the verification link!</p>
              <p className="text-sm text-gray-500">Click the link in the email to continue.</p>
              <button
                onClick={() => setStep('email')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Try different email
              </button>
            </div>
          )}

          {step === 'passphrase' && (
            <form onSubmit={handlePassphraseSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter your passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphraseValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  autoComplete="new-password"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  This passphrase decrypts your keys. It's never sent to the server.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-medium hover:bg-[#334155] transition-colors"
              >
                Continue
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
