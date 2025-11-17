import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRef, forwardRef, useImperativeHandle } from "react";

interface LoginFormProps {
  onClose: () => void;
}

export interface LoginFormRef {
  focusEmail: () => void;
}

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
const EmailInput = ({ inputRef }: { inputRef?: React.RefObject<HTMLInputElement> }) => {
  return (
    <input
      ref={inputRef}
      type="email"
      placeholder="EMAIL"
      className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
      required
    />
  );
};

// Password Input Component
const PasswordInput = () => {
  return (
    <input
      type="password"
      placeholder="PASSWORD"
      className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
      required
    />
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

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(({ onClose }, ref) => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Expose focusEmail method to parent component
  useImperativeHandle(ref, () => ({
    focusEmail: () => {
      emailInputRef.current?.focus();
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
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
            <EmailInput inputRef={emailInputRef} />
            <PasswordInput />
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
