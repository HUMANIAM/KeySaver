import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Search, Trash2 } from "lucide-react";
import { KeyEntry } from "../../types";
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

interface DeleteKeysProps {
  entries: KeyEntry[];
  onDelete: (id: string) => void;
}

export function DeleteKeys({ entries, onDelete }: DeleteKeysProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteKey, setDeleteKey] = useState("");

  const filteredEntries = entries.filter(entry => {
    const query = searchQuery.toLowerCase();
    return (
      entry.key.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleDeleteClick = (entry: KeyEntry) => {
    setDeleteId(entry.id);
    setDeleteKey(entry.key);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      setDeleteKey("");
    }
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
            <div className="space-y-2">
              <Label htmlFor="delete-search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="delete-search"
                  placeholder="Search by key or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredEntries.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchQuery ? "No keys found matching your search" : "No keys saved yet"}
                </p>
              ) : (
                filteredEntries.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-gray-500">Key</Label>
                            <p>{entry.key}</p>
                          </div>
                          {entry.tags.length > 0 && (
                            <div>
                              <Label className="text-gray-500">Tags</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {entry.tags.map(tag => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(entry)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the key "{deleteKey}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
