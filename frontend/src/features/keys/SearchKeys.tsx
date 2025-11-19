import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../shared/ui/card";
import { KeyEntry } from "../../shared/types";
import { KeyEntryCard } from "./KeyEntryCard";
import { SearchInput } from "../../shared/components/SearchInput";
import { EmptyState } from "./EmptyState";
import { useRevealedValues, useSearchFilter } from "../../shared/hooks";

/** List of filtered key entries */
function KeysList({ 
  entries, 
  revealedValues, 
  onToggleReveal 
}: { 
  entries: KeyEntry[]; 
  revealedValues: Set<number>; 
  onToggleReveal: (id: number) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <KeyEntryCard
          key={entry.id}
          entry={entry}
          isValueRevealed={revealedValues.has(entry.id)}
          onToggleReveal={() => onToggleReveal(entry.id)}
        />
      ))}
    </div>
  );
}

// Main Component

interface SearchKeysProps {
  entries: KeyEntry[];
}

export function SearchKeys({ entries }: SearchKeysProps) {
  const revealedValues = useRevealedValues();
  const searchFilter = useSearchFilter(entries);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Search Keys</CardTitle>
        <CardDescription>Search by key name or tags</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchInput value={searchFilter.searchQuery} onChange={searchFilter.setSearchQuery} />

          {!searchFilter.hasResults ? (
            <EmptyState hasSearchQuery={searchFilter.hasQuery} />
          ) : (
            <KeysList 
              entries={searchFilter.filteredEntries}
              revealedValues={revealedValues.revealedIds}
              onToggleReveal={revealedValues.toggle}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
