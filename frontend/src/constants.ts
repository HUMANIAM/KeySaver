/**
 * Application constants
 * WHY: Same as backend - eliminate magic strings/numbers
 * BENEFIT: Single source of truth, type-safe, self-documenting
 */

// Passphrase validation
export const PASSPHRASE_VALIDATION_STRING = "PASSPHRASE_VALIDATION_TEST";

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "keysaver_token",
} as const;

// UI Constants
export const MASKED_VALUE_PLACEHOLDER = "•".repeat(12);
export const MAX_TAG_LENGTH = 50;
export const MAX_KEY_NAME_LENGTH = 100;

// Error Messages (standardized)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue.",
  INVALID_PASSPHRASE: "Incorrect passphrase! Please try again.",
  PASSPHRASE_REQUIRED: "Passphrase is required.",
  GENERIC_ERROR: "An error occurred. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  KEY_ADDED: "Key added successfully",
  KEY_UPDATED: "Key updated successfully",
  KEY_DELETED: "Key deleted successfully",
} as const;
