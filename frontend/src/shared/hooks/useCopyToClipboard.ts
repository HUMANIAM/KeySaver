/**
 * Custom hook for copying text to clipboard
 * Provides copy functionality with success state feedback
 */
import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedText(null), 2000);
      
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return {
    copy,
    copiedText,
    isCopied: copiedText !== null,
  };
}
