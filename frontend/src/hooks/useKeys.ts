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
import * as api from "../services/api";
import { encrypt, decrypt, getPassphrase } from "../utils/encryption";
import { KeyEntry } from "../types";

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
      const { keys } = await api.fetchKeys();
      const decrypted = keys.map((k: any) => ({
        ...k,
        value: decrypt(k.value),
      }));
      setEntries(decrypted);
    } catch (err: any) {
      setError(err.message || "Failed to load keys");
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
      } catch (err: any) {
        setError(err.message || "Failed to add key");
        throw err;
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
      } catch (err: any) {
        setError(err.message || "Failed to update key");
        throw err;
      }
    },
    [loadKeys]
  );

  const deleteKey = useCallback(
    async (id: number) => {
      try {
        await api.deleteKey(id);
        await loadKeys();
      } catch (err: any) {
        setError(err.message || "Failed to delete key");
        throw err;
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
