/**
 * Pure helper functions for authentication
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extracts token from URL query parameters
 */
export function extractTokenFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

/**
 * Removes token from URL without page reload
 */
export function clearTokenFromURL(): void {
  window.history.replaceState({}, '', window.location.pathname);
}

/**
 * Maps error to user-friendly message
 */
export function mapErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
