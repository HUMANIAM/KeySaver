import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { KeyEntry } from '../../shared/types';
import { KeyEntryCard } from './KeyEntryCard';
import { SearchInput } from '../../shared/components/SearchInput';
import { EmptyState } from './EmptyState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../shared/ui/alert-dialog';

// Shared form components
import { FormField, SecretInput, TagsInput } from '../../shared/components/forms';

// Custom hooks
import {
  useVisibilityToggle,
  useTagsManager,
  useRevealedValues,
  useSearchFilter,
} from '../../shared/hooks';

// Sub-components

/** List of keys with edit and delete buttons */
function KeysListWithActions({
  entries,
  revealedValues,
  onToggleReveal,
  onEditClick,
  onDeleteClick
}: {
  entries: KeyEntry[];
  revealedValues: Set<number>;
  onToggleReveal: (id: number) => void;
  onEditClick: (entry: KeyEntry) => void;
  onDeleteClick: (id: number, keyName: string) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <div key={entry.id} className="relative">
          <KeyEntryCard
            entry={entry}
            isValueRevealed={revealedValues.has(entry.id)}
            onToggleReveal={() => onToggleReveal(entry.id)}
            className="pr-24"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditClick(entry)}
              title="Edit key"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteClick(entry.id, entry.key)}
              title="Delete key"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Delete confirmation dialog */
function DeleteConfirmationDialog({
  isOpen,
  keyName,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  keyName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the key "{keyName}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

/** Search view - manage keys with edit/delete actions */
function ManageView({
  searchQuery,
  onSearchChange,
  filteredEntries,
  hasQuery,
  revealedIds,
  onToggleReveal,
  onEditClick,
  onDeleteClick,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredEntries: KeyEntry[];
  hasQuery: boolean;
  revealedIds: Set<number>;
  onToggleReveal: (id: number) => void;
  onEditClick: (entry: KeyEntry) => void;
  onDeleteClick: (id: number, keyName: string) => void;
}) {
  return (
    <div className="space-y-4">
      <SearchInput id="manage-search" value={searchQuery} onChange={onSearchChange} />

      {filteredEntries.length === 0 ? (
        <EmptyState hasSearchQuery={hasQuery} />
      ) : (
        <KeysListWithActions
          entries={filteredEntries}
          revealedValues={revealedIds}
          onToggleReveal={onToggleReveal}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      )}
    </div>
  );
}

// Main Component

interface ManageKeysProps {
  entries: KeyEntry[];
  onUpdate: (id: number, key: string, value: string, tags: string[]) => void;
  onDelete: (id: number) => void;
}

export function ManageKeys({ entries, onUpdate, onDelete }: ManageKeysProps) {
  // State for selected entry (edit mode)
  const [selectedEntry, setSelectedEntry] = useState<KeyEntry | null>(null);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  // State for delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteKey, setDeleteKey] = useState("");

  // Custom hooks for state management
  const secretVisibility = useVisibilityToggle();
  const tagsManager = useTagsManager();
  const revealedValues = useRevealedValues();
  const searchFilter = useSearchFilter(entries);

  // Edit handlers
  const handleEditClick = (entry: KeyEntry) => {
    setSelectedEntry(entry);
    setKey(entry.key);
    setValue(entry.value);
    tagsManager.setTags(entry.tags);
    secretVisibility.hide();
    searchFilter.setSearchQuery('');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEntry && key.trim() && value.trim()) {
      onUpdate(selectedEntry.id, key, value, tagsManager.tags);
      handleEditCancel();
    }
  };

  const handleEditCancel = () => {
    setSelectedEntry(null);
    setKey('');
    setValue('');
    tagsManager.clearTags();
    secretVisibility.hide();
  };

  // Delete handlers
  const handleDeleteClick = (id: number, keyName: string) => {
    setDeleteId(id);
    setDeleteKey(keyName);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      setDeleteKey("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setDeleteKey("");
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Manage Keys</CardTitle>
          <CardDescription>
            {selectedEntry 
              ? 'Update the selected key' 
              : 'Search, edit, and delete keys'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedEntry ? (
            <ManageView
              searchQuery={searchFilter.searchQuery}
              onSearchChange={searchFilter.setSearchQuery}
              filteredEntries={searchFilter.filteredEntries}
              hasQuery={searchFilter.hasQuery}
              revealedIds={revealedValues.revealedIds}
              onToggleReveal={revealedValues.toggle}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <UpdateForm
              keyValue={key}
              value={value}
              secretVisibility={secretVisibility}
              tagsManager={tagsManager}
              onKeyChange={setKey}
              onValueChange={setValue}
              onSubmit={handleUpdateSubmit}
              onCancel={handleEditCancel}
            />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={deleteId !== null}
        keyName={deleteKey}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
