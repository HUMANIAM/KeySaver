/**
 * Custom hook for form state management
 * Reduces boilerplate and ensures consistency
 */
import { useState, useCallback } from 'react';

interface UseFormStateOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Record<string, string>;
}

export function useFormState<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormStateOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user types
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setSubmitError('');

      // Validation
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      // Submit
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        reset();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, reset]
  );

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    setValue,
    setValues,
    reset,
    handleSubmit,
    setSubmitError,
  };
}
