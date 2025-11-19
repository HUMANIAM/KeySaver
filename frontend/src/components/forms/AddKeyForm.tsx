import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { KeyEntry } from "../../types";

/** Display error message */
function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
      {message}
    </div>
  );
}

/** Input field for key name */
function KeyNameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="key">Key</Label>
      <Input
        id="key"
        placeholder="Enter key name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        required
      />
    </div>
  );
}

/** Input field for secret value with visibility toggle */
function SecretValueInput({ 
  value, 
  showValue, 
  onChange, 
  onToggleVisibility 
}: { 
  value: string; 
  showValue: boolean; 
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="value">Value (Secret)</Label>
      <div className="relative">
        <Input
          id="value"
          type={showValue ? "text" : "password"}
          placeholder="Enter secret value"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          required
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={onToggleVisibility}
        >
          {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

/** Tag input with add/remove functionality */
function TagsInput({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag
}: {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <div className="flex gap-2">
        <Input
          id="tags"
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
  );
}


interface AddKeyFormProps {
  onAdd: (key: string, value: string, tags: string[]) => void;
  entries: KeyEntry[];
}

export function AddKeyForm({ onAdd, entries }: AddKeyFormProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

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
    setError("");
    
    if (!key.trim() || !value.trim()) {
      setError("Key and value are required");
      return;
    }
    
    // Check for duplicate key
    const isDuplicate = entries.some(entry => 
      entry.key.toLowerCase() === key.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setError(`Key "${key}" already exists. Please use a different name or update the existing one.`);
      return;
    }
    
    onAdd(key, value, tags);
    setKey("");
    setValue("");
    setTags([]);
    setTagInput("");
    setShowValue(false);
    setError("");
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add New Key</CardTitle>
        <CardDescription>Store a new key-value pair with optional tags</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorAlert message={error} />
          
          <KeyNameInput 
            value={key} 
            onChange={setKey} 
          />
          
          <SecretValueInput
            value={value}
            showValue={showValue}
            onChange={setValue}
            onToggleVisibility={() => setShowValue(!showValue)}
          />
          
          <TagsInput
            tags={tags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />

          <Button type="submit" className="w-full">Add Key</Button>
        </form>
      </CardContent>
    </Card>
  );
}
