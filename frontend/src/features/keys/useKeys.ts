/**
 * Custom hook for key management
 * WHY: Extract repeated logic, reduce duplication (DRY)
 * BEFORE: API calls duplicated in KeyManager
 * AFTER: Reusable hook with consistent error handling
 * BENEFITS:
 * - Single source of truth for key operations
 * - Consistent error handling
 * - Loading states managed in one place
 * - Easy to test
 * - Reduces KeyManager from 130 lines to ~50 lines
 */

import { useState, useEffect, useCallback } from "react";
import * as api from "../../services/api";
import { encrypt, decrypt, getPassphrase } from "../../shared/utils/encryption";
import { KeyEntry } from "../../shared/types";

interface ApiKey {
  id: number;
  key: string;
  value: string;
  tags: string[];
  createdAt: number;
}

interface UseKeysReturn {
  entries: KeyEntry[];
  loading: boolean;
  error: string | null;
  addKey: (key: string, value: string, tags: string[]) => Promise<void>;
  updateKey: (id: number, key: string, value: string, tags: string[]) => Promise<void>;
  deleteKey: (id: number) => Promise<void>;
  refreshKeys: () => Promise<void>;
}

export function useKeys(): UseKeysReturn {
  const [entries, setEntries] = useState<KeyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
    const passphrase = getPassphrase();
    if (!passphrase) {
      setError("Passphrase not set. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { keys } = (await api.fetchKeys()) as { keys: ApiKey[] };
      const decrypted: KeyEntry[] = keys.map((k) => ({
        ...k,
        value: decrypt(k.value),
      }));
      setEntries(decrypted);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load keys";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const addKey = useCallback(
    async (key: string, value: string, tags: string[]) => {
      try {
        const encrypted = encrypt(value);
        await api.createKey(key, encrypted, tags);
        await loadKeys();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to add key";
        setError(message);
        throw error;
      }
    },
    [loadKeys]
  );

  const updateKey = useCallback(
    async (id: number, key: string, value: string, tags: string[]) => {
      try {
        const encrypted = encrypt(value);
        await api.updateKey(id, key, encrypted, tags);
        await loadKeys();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update key";
        setError(message);
        throw error;
      }
    },
    [loadKeys]
  );

  const deleteKey = useCallback(
    async (id: number) => {
      try {
        await api.deleteKey(id);
        await loadKeys();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to delete key";
        setError(message);
        throw error;
      }
    },
    [loadKeys]
  );

  return {
    entries,
    loading,
    error,
    addKey,
    updateKey,
    deleteKey,
    refreshKeys: loadKeys,
  };
}
