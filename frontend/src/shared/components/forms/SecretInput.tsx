/**
 * Secret input field with visibility toggle
 * Reusable across all forms that handle sensitive data
 */
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface SecretInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export function SecretInput({
  id,
  value,
  onChange,
  isVisible,
  onToggleVisibility,
  placeholder = 'Enter secret value',
  autoComplete = 'new-password',
  required = false,
  autoFocus = false,
}: SecretInputProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={isVisible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        autoFocus={autoFocus}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        onClick={onToggleVisibility}
        aria-label={isVisible ? 'Hide value' : 'Show value'}
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
