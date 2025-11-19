/**
 * Base form field component with label
 * Follows composition pattern for flexibility
 */
import { ReactNode } from 'react';
import { Label } from '../../ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  helpText?: string;
  error?: string;
}

export function FormField({ id, label, children, helpText, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
