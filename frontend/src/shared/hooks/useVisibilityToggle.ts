/**
 * Custom hook for visibility toggle pattern
 * DRY principle - reusable across all secret fields
 */
import { useState, useCallback } from 'react';

export function useVisibilityToggle(initialValue = false) {
  const [isVisible, setIsVisible] = useState(initialValue);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    toggle,
    show,
    hide,
  };
}
