import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff, Plus, X, Edit } from "lucide-react";
import { KeyEntry } from "../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UpdateKeyProps {
  entries: KeyEntry[];
  onUpdate: (id: string, key: string, value: string, tags: string[]) => void;
}

export function UpdateKey({ entries, onUpdate }: UpdateKeyProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSelectEntry = (id: string) => {
    setSelectedId(id);
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setKey(entry.key);
      setValue(entry.value);
      setTags(entry.tags);
      setShowValue(false);
    }
  };

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
      setSelectedId("");
      setKey("");
      setValue("");
      setTags([]);
      setShowValue(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Update Key</CardTitle>
        <CardDescription>Select and update an existing key</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="select-key">Select Key to Update</Label>
            <Select value={selectedId} onValueChange={handleSelectEntry}>
              <SelectTrigger id="select-key">
                <SelectValue placeholder="Choose a key to update..." />
              </SelectTrigger>
              <SelectContent>
                {entries.length === 0 ? (
                  <div className="px-2 py-6 text-center text-gray-500">
                    No keys available
                  </div>
                ) : (
                  entries.map(entry => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.key}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedId && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="update-key">Key</Label>
                <Input
                  id="update-key"
                  placeholder="Enter key name"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
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
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowValue(!showValue)}
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
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
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
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Update Key
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
