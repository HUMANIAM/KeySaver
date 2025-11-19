/**
 * Custom hook for managing revealed/hidden values
 * DRY - Used across Search, Update, Delete components
 */
import { useState, useCallback } from 'react';

export function useRevealedValues() {
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const toggle = useCallback((id: number) => {
    setRevealedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const reveal = useCallback((id: number) => {
    setRevealedIds((prev) => new Set(prev).add(id));
  }, []);

  const hide = useCallback((id: number) => {
    setRevealedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isRevealed = useCallback((id: number) => revealedIds.has(id), [revealedIds]);

  const clear = useCallback(() => {
    setRevealedIds(new Set());
  }, []);

  return {
    revealedIds,
    toggle,
    reveal,
    hide,
    isRevealed,
    clear,
  };
}
