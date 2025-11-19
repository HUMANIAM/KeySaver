interface EmptyStateProps {
  hasSearchQuery: boolean;
  searchMessage?: string;
  emptyMessage?: string;
}

/**
 * Reusable empty state message
 * Used across: SearchKeys, DeleteKeys, UpdateKey
 */
export function EmptyState({ 
  hasSearchQuery,
  searchMessage = "No keys found matching your search",
  emptyMessage = "No keys saved yet"
}: EmptyStateProps) {
  return (
    <p className="text-center text-gray-500 py-8">
      {hasSearchQuery ? searchMessage : emptyMessage}
    </p>
  );
}
