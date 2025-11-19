/**
 * Custom hook for tags management
 * Encapsulates all tags-related logic
 */
import { useState, useCallback } from 'react';

interface UseTagsManagerOptions {
  initialTags?: string[];
  maxTags?: number;
  validateTag?: (tag: string) => boolean;
}

export function useTagsManager(options: UseTagsManagerOptions = {}) {
  const { initialTags = [], maxTags, validateTag } = options;

  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const addTag = useCallback(() => {
    const trimmedTag = inputValue.trim();

    // Validation
    if (!trimmedTag) {
      setError('Tag cannot be empty');
      return false;
    }

    if (tags.includes(trimmedTag)) {
      setError('Tag already exists');
      return false;
    }

    if (maxTags && tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return false;
    }

    if (validateTag && !validateTag(trimmedTag)) {
      setError('Invalid tag format');
      return false;
    }

    // Add tag
    setTags((prev) => [...prev, trimmedTag]);
    setInputValue('');
    setError('');
    return true;
  }, [inputValue, tags, maxTags, validateTag]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setError('');
  }, []);

  const clearTags = useCallback(() => {
    setTags([]);
    setInputValue('');
    setError('');
  }, []);

  const setTagsDirectly = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  return {
    tags,
    inputValue,
    error,
    setInputValue,
    addTag,
    removeTag,
    clearTags,
    setTags: setTagsDirectly,
  };
}
