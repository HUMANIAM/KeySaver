/**
 * Custom hook for search and filter functionality
 * DRY - Used across all key management views
 */
import { useState, useMemo } from 'react';
import { KeyEntry } from '../types';
import { filterEntriesByQuery } from '../utils/keyEntry.utils';

export function useSearchFilter(entries: KeyEntry[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(
    () => filterEntriesByQuery(entries, searchQuery),
    [entries, searchQuery]
  );

  const hasResults = filteredEntries.length > 0;
  const hasQuery = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredEntries,
    hasResults,
    hasQuery,
  };
}
