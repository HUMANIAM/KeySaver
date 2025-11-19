import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Trash2 } from "lucide-react";
import { KeyEntry } from "../../types";
import { KeyEntryCard } from "../shared/KeyEntryCard";
import { SearchInput } from "../shared/SearchInput";
import { EmptyState } from "../shared/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Sub-Components

/** List of keys with delete buttons */
function KeysListWithDelete({
  entries,
  revealedValues,
  onToggleReveal,
  onDeleteClick
}: {
  entries: KeyEntry[];
  revealedValues: Set<number>;
  onToggleReveal: (id: number) => void;
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
            className="pr-16"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => onDeleteClick(entry.id, entry.key)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

// Main Component

interface DeleteKeysProps {
  entries: KeyEntry[];
  onDelete: (id: number) => void;
}

export function DeleteKeys({ entries, onDelete }: DeleteKeysProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedValues, setRevealedValues] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteKey, setDeleteKey] = useState("");

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
          <CardTitle>Delete Keys</CardTitle>
          <CardDescription>Search and delete keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SearchInput 
              id="delete-search"
              value={searchQuery} 
              onChange={setSearchQuery} 
            />

            {filteredEntries.length === 0 ? (
              <EmptyState hasSearchQuery={!!searchQuery} />
            ) : (
              <KeysListWithDelete
                entries={filteredEntries}
                revealedValues={revealedValues}
                onToggleReveal={toggleReveal}
                onDeleteClick={handleDeleteClick}
              />
            )}
          </div>
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
