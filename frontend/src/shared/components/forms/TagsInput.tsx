/**
 * Tags input component with add/remove functionality
 * Reusable for any tagging system
 */
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Plus, X } from 'lucide-react';

interface TagsInputProps {
  id: string;
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagsInput({
  id,
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  placeholder = 'Add a tag',
  maxTags,
}: TagsInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  const isMaxTagsReached = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
          disabled={isMaxTagsReached}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAddTag}
          disabled={!inputValue.trim() || isMaxTagsReached}
          aria-label="Add tag"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 hover:text-red-600"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {maxTags && (
        <p className="text-xs text-gray-500">
          {tags.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
}
