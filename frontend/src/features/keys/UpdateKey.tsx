/**
 * UpdateKey - Refactored with composition and DRY principles
 * BEFORE: 290 lines, god component with 95-line form
 * AFTER: Clean composition with reusable components
 */
import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';
import { KeyEntry } from '../../shared/types';
import { KeyEntryCard } from './KeyEntryCard';
import { SearchInput } from '../../shared/components/SearchInput';
import { EmptyState } from './EmptyState';

// Shared form components
import { FormField, SecretInput, TagsInput } from '../../shared/components/forms';

// Custom hooks
import {
  useVisibilityToggle,
  useTagsManager,
  useRevealedValues,
  useSearchFilter,
} from '../../shared/hooks';

// Sub-components for composition

/** List of selectable key entries */
function SelectableKeysList({
  entries,
  revealedIds,
  onToggleReveal,
  onSelect,
}: {
  entries: KeyEntry[];
  revealedIds: Set<number>;
  onToggleReveal: (id: number) => void;
  onSelect: (entry: KeyEntry) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <KeyEntryCard
          key={entry.id}
          entry={entry}
          isValueRevealed={revealedIds.has(entry.id)}
          onToggleReveal={() => onToggleReveal(entry.id)}
          onClick={() => onSelect(entry)}
        />
      ))}
    </div>
  );
}

/** Back button component */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="mb-2">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to list
    </Button>
  );
}

/** Form action buttons */
function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex gap-2">
      <Button type="submit" className="flex-1">
        <Edit className="h-4 w-4 mr-2" />
        Update Key
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}

/** Update form with all fields */
function UpdateForm({
  keyValue,
  value,
  secretVisibility,
  tagsManager,
  onKeyChange,
  onValueChange,
  onSubmit,
  onCancel,
}: {
  keyValue: string;
  value: string;
  secretVisibility: ReturnType<typeof useVisibilityToggle>;
  tagsManager: ReturnType<typeof useTagsManager>;
  onKeyChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <BackButton onClick={onCancel} />

      <form onSubmit={onSubmit} className="space-y-4 pt-4 border-t">
        <FormField id="update-key" label="Key" helpText="Key name identifier">
          <Input
            id="update-key"
            placeholder="Enter key name"
            value={keyValue}
            onChange={(e) => onKeyChange(e.target.value)}
            autoComplete="off"
            required
          />
        </FormField>

        <FormField
          id="update-value"
          label="Value (Secret)"
          helpText="Updated secret value"
        >
          <SecretInput
            id="update-value"
            value={value}
            onChange={onValueChange}
            isVisible={secretVisibility.isVisible}
            onToggleVisibility={secretVisibility.toggle}
            required
          />
        </FormField>

        <FormField id="update-tags" label="Tags" helpText="Update tags">
          <TagsInput
            id="update-tags"
            tags={tagsManager.tags}
            inputValue={tagsManager.inputValue}
            onInputChange={tagsManager.setInputValue}
            onAddTag={tagsManager.addTag}
            onRemoveTag={tagsManager.removeTag}
          />
        </FormField>

        <FormActions onCancel={onCancel} />
      </form>
    </div>
  );
}

/** Search view - select a key to update */
function SearchView({
  searchQuery,
  onSearchChange,
  filteredEntries,
  hasQuery,
  revealedIds,
  onToggleReveal,
  onSelect,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredEntries: KeyEntry[];
  hasQuery: boolean;
  revealedIds: Set<number>;
  onToggleReveal: (id: number) => void;
  onSelect: (entry: KeyEntry) => void;
}) {
  return (
    <div className="space-y-4">
      <SearchInput id="update-search" value={searchQuery} onChange={onSearchChange} />

      {filteredEntries.length === 0 ? (
        <EmptyState hasSearchQuery={hasQuery} />
      ) : (
        <SelectableKeysList
          entries={filteredEntries}
          revealedIds={revealedIds}
          onToggleReveal={onToggleReveal}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

// Main Component

interface UpdateKeyProps {
  entries: KeyEntry[];
  onUpdate: (id: number, key: string, value: string, tags: string[]) => void;
}

export function UpdateKey({ entries, onUpdate }: UpdateKeyProps) {
  // State for selected entry
  const [selectedEntry, setSelectedEntry] = useState<KeyEntry | null>(null);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  // Custom hooks for state management
  const secretVisibility = useVisibilityToggle();
  const tagsManager = useTagsManager();
  const revealedValues = useRevealedValues();
  const searchFilter = useSearchFilter(entries);

  // Event handlers
  const handleSelectEntry = (entry: KeyEntry) => {
    setSelectedEntry(entry);
    setKey(entry.key);
    setValue(entry.value);
    tagsManager.setTags(entry.tags);
    secretVisibility.hide();
    searchFilter.setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEntry && key.trim() && value.trim()) {
      onUpdate(selectedEntry.id, key, value, tagsManager.tags);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setSelectedEntry(null);
    setKey('');
    setValue('');
    tagsManager.clearTags();
    secretVisibility.hide();
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Update Key</CardTitle>
        <CardDescription>
          {selectedEntry ? 'Update the selected key' : 'Search and select a key to update'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedEntry ? (
          <SearchView
            searchQuery={searchFilter.searchQuery}
            onSearchChange={searchFilter.setSearchQuery}
            filteredEntries={searchFilter.filteredEntries}
            hasQuery={searchFilter.hasQuery}
            revealedIds={revealedValues.revealedIds}
            onToggleReveal={revealedValues.toggle}
            onSelect={handleSelectEntry}
          />
        ) : (
          <UpdateForm
            keyValue={key}
            value={value}
            secretVisibility={secretVisibility}
            tagsManager={tagsManager}
            onKeyChange={setKey}
            onValueChange={setValue}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}
