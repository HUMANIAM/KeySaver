/**
 * Non-dismissable passphrase modal for timeout scenarios
 * Uses shared PassphraseStep component for consistency
 */
import { useState } from 'react';
import { setPassphrase } from '../../../shared/utils/encryption';
import { getUserValidator } from '../../../services/api';
import { validatePassphrase } from '../auth.service';
import { PASSPHRASE_VALIDATION_STRING } from '../../../shared/constants';
import { PassphraseStep } from './PassphraseStep';

interface PassphraseModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function PassphraseModal({ isOpen, onSuccess }: PassphraseModalProps) {
  const [passphrase, setPassphraseValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passphrase) {
      setError('Passphrase is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user's stored validator from backend
      const result = await getUserValidator();
      const storedValidator = result.validator;
      
      // Set passphrase in memory first (needed for validation)
      setPassphrase(passphrase);
      
      // Validate passphrase using existing logic
      validatePassphrase(storedValidator, PASSPHRASE_VALIDATION_STRING);
      
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid passphrase';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PassphraseStep
      passphrase={passphrase}
      onPassphraseChange={setPassphraseValue}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Enter Passphrase"
      isStandalone={true}
    />
  );
}
