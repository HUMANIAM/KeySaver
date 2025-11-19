import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface AddKeyFormProps {
  onAdd: (key: string, value: string, tags: string[]) => void;
}

export function AddKeyForm({ onAdd }: AddKeyFormProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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
    if (key.trim() && value.trim()) {
      onAdd(key, value, tags);
      setKey("");
      setValue("");
      setTags([]);
      setTagInput("");
      setShowValue(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add New Key</CardTitle>
        <CardDescription>Store a new key-value pair with optional tags</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              placeholder="Enter key name"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (Secret)</Label>
            <div className="relative">
              <Input
                id="value"
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
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
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

          <Button type="submit" className="w-full">Add Key</Button>
        </form>
      </CardContent>
    </Card>
  );
}
