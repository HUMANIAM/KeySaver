import CryptoJS from 'crypto-js';

// In-memory passphrase storage (cleared on page refresh)
let passphrase: string | null = null;

export const setPassphrase = (pass: string) => {
  passphrase = pass;
};

export const getPassphrase = (): string | null => {
  return passphrase;
};

export const clearPassphrase = () => {
  passphrase = null;
};

export const encrypt = (value: string): string => {
  if (!passphrase) throw new Error('Passphrase not set');
  return CryptoJS.AES.encrypt(value, passphrase).toString();
};

export const decrypt = (encrypted: string): string => {
  if (!passphrase) throw new Error('Passphrase not set');
  const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};
