/**
 * Email input step component
 */
import { forwardRef } from 'react';

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EmailStep = forwardRef<HTMLInputElement, EmailStepProps>(
  ({ email, onEmailChange, onSubmit }, ref) => {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          ref={ref}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
    );
  }
);

EmailStep.displayName = 'EmailStep';
