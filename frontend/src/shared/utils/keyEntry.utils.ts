/**
 * Utility functions for KeyEntry operations
 * Pure functions - easy to test and reuse
 */
import { KeyEntry } from '../types';

/**
 * Filter entries by search query
 * Searches in key name and tags
 */
export function filterEntriesByQuery(entries: KeyEntry[], query: string): KeyEntry[] {
  if (!query.trim()) {
    return entries;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return entries.filter((entry) => {
    const keyMatch = entry.key.toLowerCase().includes(normalizedQuery);
    const tagsMatch = entry.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    return keyMatch || tagsMatch;
  });
}

/**
 * Check if a key name already exists in entries
 */
export function isDuplicateKey(entries: KeyEntry[], keyName: string, excludeId?: number): boolean {
  const normalizedKey = keyName.trim();
  return entries.some((entry) => 
    entry.key === normalizedKey && entry.id !== excludeId
  );
}

/**
 * Extract all unique tags from entries
 */
export function extractUniqueTags(entries: KeyEntry[]): string[] {
  const allTags = entries.flatMap((entry) => entry.tags);
  return Array.from(new Set(allTags)).sort();
}
