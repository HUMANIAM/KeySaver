import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { KeyEntry } from "../../types";
import { KeyEntryCard } from "../shared/KeyEntryCard";
import { SearchInput } from "../shared/SearchInput";
import { EmptyState } from "../shared/EmptyState";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedValues, setRevealedValues] = useState<Set<number>>(new Set());

  const toggleReveal = (id: number) => {
    const newRevealed = new Set(revealedValues);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedValues(newRevealed);
  };

  const filteredEntries = entries.filter(entry => {
    const query = searchQuery.toLowerCase();
    return (
      entry.key.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Search Keys</CardTitle>
        <CardDescription>Search by key name or tags</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          {filteredEntries.length === 0 ? (
            <EmptyState hasSearchQuery={!!searchQuery} />
          ) : (
            <KeysList 
              entries={filteredEntries}
              revealedValues={revealedValues}
              onToggleReveal={toggleReveal}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
