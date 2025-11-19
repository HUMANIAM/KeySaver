import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRef, forwardRef, useImperativeHandle, useState } from "react";

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export interface LoginFormRef {
  focusEmail: () => void;
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

// Google Login Button Component
const GoogleLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

// Divider Component
const Divider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">or</span>
      </div>
    </div>
  );
};

// Email Input Component
const EmailInput = ({ 
  inputRef, 
  value, 
  onChange,
  onBlur,
  error,
  hint 
}: { 
  inputRef?: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
}) => {
  return (
    <div>
      <input
        ref={inputRef}
        type="email"
        placeholder="EMAIL"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium placeholder-gray-700 focus:outline-none focus:ring-2 ${
          error ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {!error && hint && <p className="text-gray-500 text-xs mt-1.5">{hint}</p>}
    </div>
  );
};

// Password Input Component
const PasswordInput = ({ 
  value, 
  onChange,
  onBlur,
  error,
  hint 
}: { 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
}) => {
  return (
    <div>
      <input
        type="password"
        placeholder="PASSWORD"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium placeholder-gray-700 focus:outline-none focus:ring-2 ${
          error ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {!error && hint && <p className="text-gray-500 text-xs mt-1.5">{hint}</p>}
    </div>
  );
};

// Login Button Component
const LoginButton = () => {
  return (
    <button
      type="submit"
      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
    >
      Log in
    </button>
  );
};

// Reset Password Link Component
const ResetPasswordLink = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onClick}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Reset password
      </button>
    </div>
  );
};

// Create Account Link Component
const CreateAccountLink = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="text-center text-sm text-gray-600">
      No account?{" "}
      <button
        type="button"
        onClick={onClick}
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        Create one
      </button>
    </div>
  );
};

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(({ onClose, onLoginSuccess }, ref) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  // Expose focusEmail method to parent component
  useImperativeHandle(ref, () => ({
    focusEmail: () => {
      emailInputRef.current?.focus();
    }
  }));

  // Validate email on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched.email) {
      if (!value) {
        setEmailError("Email is required");
      } else if (!isValidEmail(value)) {
        setEmailError("Please enter a valid email address (e.g., user@example.com)");
      } else {
        setEmailError("");
      }
    }
  };

  // Validate password on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      if (!value) {
        setPasswordError("Password is required");
      } else if (!isValidPassword(value)) {
        setPasswordError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number");
      } else {
        setPasswordError("");
      }
    }
  };

  // Mark email as touched on blur
  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    if (!email) {
      setEmailError("Email is required");
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address (e.g., user@example.com)");
    }
  };

  // Mark password as touched on blur
  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!password) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number");
      return;
    }
    
    // All valid - proceed to KeyManager
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here - for now, just call onLoginSuccess
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleResetPassword = () => {
    // Redirect to reset password form
  };

  const handleCreateAccount = () => {
    // Redirect to create account form
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] bg-white">
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        </button>

        <div className="space-y-4 mt-4">
          <GoogleLoginButton onClick={handleGoogleLogin} />
          
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailInput 
              inputRef={emailInputRef}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={emailError}
              hint={!touched.email ? "Enter your email address" : undefined}
            />
            <PasswordInput 
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError}
              hint={!touched.password ? "Min 8 chars, 1 uppercase, 1 lowercase, 1 number" : undefined}
            />
            <LoginButton />
            <ResetPasswordLink onClick={handleResetPassword} />
            <CreateAccountLink onClick={handleCreateAccount} />
          </form>
        </div>
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
