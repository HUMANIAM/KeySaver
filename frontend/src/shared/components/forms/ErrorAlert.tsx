/**
 * Reusable error alert component
 * Consistent error display across the application
 */
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-start gap-2">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
