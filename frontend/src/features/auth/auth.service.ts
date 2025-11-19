/**
 * Authentication service - encapsulates all auth API interactions
 */
import { sendAuthLink, verifyToken, setValidator, setToken } from '../../services/api';
import { encrypt, decrypt, setPassphrase } from '../../shared/utils/encryption';
import { PASSPHRASE_VALIDATION_STRING } from '../../shared/constants';

export interface AuthResult {
  verified: boolean;
  token?: string;
  user?: {
    passphrase_validator?: string;
  };
}

export interface TokenVerificationResult {
  token: string;
  user: {
    passphrase_validator?: string;
  };
}

/**
 * Sends authentication link to user's email
 */
export async function sendLoginLink(email: string): Promise<AuthResult> {
  return await sendAuthLink(email);
}

/**
 * Verifies email token from URL
 */
export async function verifyEmailToken(token: string): Promise<TokenVerificationResult> {
  return await verifyToken(token);
}

/**
 * Validates user's passphrase against stored validator
 * @throws Error if passphrase is invalid
 */
export function validatePassphrase(encryptedValidator: string, expectedValue: string): void {
  const decrypted = decrypt(encryptedValidator);
  if (decrypted !== expectedValue) {
    throw new Error('Invalid passphrase');
  }
}

/**
 * Creates and stores passphrase validator for new users
 */
export async function createPassphraseValidator(validationString: string): Promise<void> {
  const encryptedValidator = encrypt(validationString);
  await setValidator(encryptedValidator);
}

/**
 * Sets passphrase in memory and stores auth token
 */
export function initializeUserSession(passphrase: string, token: string): void {
  setPassphrase(passphrase);
  setToken(token);
}

/**
 * Complete login flow for existing user with validator
 */
export async function loginExistingUser(
  passphrase: string,
  token: string,
  validator: string
): Promise<void> {
  initializeUserSession(passphrase, token);
  validatePassphrase(validator, PASSPHRASE_VALIDATION_STRING);
}

/**
 * Complete login flow for new user without validator
 */
export async function loginNewUser(
  passphrase: string,
  token: string
): Promise<void> {
  initializeUserSession(passphrase, token);
  await createPassphraseValidator(PASSPHRASE_VALIDATION_STRING);
}
