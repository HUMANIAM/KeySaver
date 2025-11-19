import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Edit, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { KeyEntry } from "../../types";
import { KeyEntryCard } from "../shared/KeyEntryCard";
import { SearchInput } from "../shared/SearchInput";
import { EmptyState } from "../shared/EmptyState";

// Sub-Components

/** List of selectable key entries */
function SelectableKeysList({
  entries,
  revealedValues,
  onToggleReveal,
  onSelect
}: {
  entries: KeyEntry[];
  revealedValues: Set<number>;
  onToggleReveal: (id: number) => void;
  onSelect: (entry: KeyEntry) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <KeyEntryCard
          key={entry.id}
          entry={entry}
          isValueRevealed={revealedValues.has(entry.id)}
          onToggleReveal={() => onToggleReveal(entry.id)}
          onClick={() => onSelect(entry)}
        />
      ))}
    </div>
  );
}

/** Update form with all fields */
function UpdateForm({
  keyValue,
  value,
  showValue,
  tags,
  tagInput,
  onKeyChange,
  onValueChange,
  onShowValueToggle,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
  onCancel
}: {
  keyValue: string;
  value: string;
  showValue: boolean;
  tags: string[];
  tagInput: string;
  onKeyChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onShowValueToggle: () => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onCancel} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to list
      </Button>

      <form onSubmit={onSubmit} className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="update-key">Key</Label>
          <Input
            id="update-key"
            placeholder="Enter key name"
            value={keyValue}
            onChange={(e) => onKeyChange(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="update-value">Value (Secret)</Label>
          <div className="relative">
            <Input
              id="update-value"
              type={showValue ? "text" : "password"}
              placeholder="Enter secret value"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              autoComplete="new-password"
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={onShowValueToggle}
            >
              {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="update-tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="update-tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddTag();
                }
              }}
            />
            <Button type="button" onClick={onAddTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Update Key
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main Component

interface UpdateKeyProps {
  entries: KeyEntry[];
  onUpdate: (id: number, key: string, value: string, tags: string[]) => void;
}

export function UpdateKey({ entries, onUpdate }: UpdateKeyProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedValues, setRevealedValues] = useState<Set<number>>(new Set());
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const toggleReveal = (id: number) => {
    const newRevealed = new Set(revealedValues);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedValues(newRevealed);
  };

  const handleSelectEntry = (entry: KeyEntry) => {
    setSelectedId(entry.id);
    setKey(entry.key);
    setValue(entry.value);
    setTags(entry.tags);
    setShowValue(false);
    setSearchQuery("");
  };

  const filteredEntries = entries.filter(entry => {
    const query = searchQuery.toLowerCase();
    return (
      entry.key.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && key.trim() && value.trim()) {
      onUpdate(selectedId, key, value, tags);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setSelectedId(null);
    setKey("");
    setValue("");
    setTags([]);
    setTagInput("");
    setShowValue(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Update Key</CardTitle>
        <CardDescription>
          {selectedId ? "Update the selected key" : "Search and select a key to update"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedId ? (
          <div className="space-y-4">
            <SearchInput 
              id="update-search"
              value={searchQuery} 
              onChange={setSearchQuery} 
            />

            {filteredEntries.length === 0 ? (
              <EmptyState hasSearchQuery={!!searchQuery} />
            ) : (
              <SelectableKeysList
                entries={filteredEntries}
                revealedValues={revealedValues}
                onToggleReveal={toggleReveal}
                onSelect={handleSelectEntry}
              />
            )}
          </div>
        ) : (
          <UpdateForm
            keyValue={key}
            value={value}
            showValue={showValue}
            tags={tags}
            tagInput={tagInput}
            onKeyChange={setKey}
            onValueChange={setValue}
            onShowValueToggle={() => setShowValue(!showValue)}
            onTagInputChange={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}
