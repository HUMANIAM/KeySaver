/**
 * Passphrase timeout management
 * Handles 2-minute inactivity timeout and page refresh scenarios
 */

import { clearPassphrase, getPassphrase } from './encryption';

const PASSPHRASE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

let inactivityTimer: number | null = null;
let onPassphraseTimeout: (() => void) | null = null;

/**
 * Set callback for when passphrase times out
 */
export const setPassphraseTimeoutCallback = (callback: () => void) => {
  onPassphraseTimeout = callback;
};

/**
 * Clear passphrase and trigger timeout callback
 */
const triggerPassphraseTimeout = () => {
  clearPassphrase();
  onPassphraseTimeout?.();
};

/**
 * Reset the inactivity timer
 */
const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  // Only set timer if passphrase exists
  if (getPassphrase()) {
    inactivityTimer = setTimeout(triggerPassphraseTimeout, PASSPHRASE_TIMEOUT_MS);
  }
};

/**
 * Start monitoring user activity for passphrase timeout
 */
export const startPassphraseTimeout = () => {
  // Add activity listeners
  ACTIVITY_EVENTS.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
  });
  
  // Start initial timer
  resetInactivityTimer();
};

/**
 * Stop monitoring user activity
 */
export const stopPassphraseTimeout = () => {
  // Remove activity listeners
  ACTIVITY_EVENTS.forEach(event => {
    document.removeEventListener(event, resetInactivityTimer, true);
  });
  
  // Clear timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

/**
 * Check if passphrase should be cleared on page load
 * Called when app mounts to handle page refresh scenario
 */
export const checkPassphraseOnMount = (): boolean => {
  // On page refresh, passphrase is always cleared (it's in memory only)
  // Return true if we should show passphrase modal
  return !getPassphrase();
};
