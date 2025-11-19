/**
 * Shared KeyEntry card component
 * WHY: DRY principle - eliminate duplicated rendering logic
 * BEFORE: ~40 lines of identical code in 3 components (Search, Update, Delete)
 * AFTER: Single reusable component
 * BENEFITS:
 * - 120 lines → 1 component
 * - Consistent UI across all views
 * - Bug fixes in one place
 * - Easier to add features
 */

import { Button } from "../../shared/ui/button";
import { Label } from "../../shared/ui/label";
import { Badge } from "../../shared/ui/badge";
import { Card, CardContent } from "../../shared/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { KeyEntry } from "../../shared/types";
import { MASKED_VALUE_PLACEHOLDER } from "../../shared/constants";

interface KeyEntryCardProps {
  entry: KeyEntry;
  isValueRevealed: boolean;
  onToggleReveal: () => void;
  onClick?: () => void;
  actions?: React.ReactNode; // Flexible action buttons
  className?: string;
}

// Sub-components for composition

/** Displays the key name field */
function KeyNameField({ keyName }: { keyName: string }) {
  return (
    <div>
      <Label className="text-gray-500">Key</Label>
      <p>{keyName}</p>
    </div>
  );
}

/** Displays the secret value with visibility toggle */
function SecretValueField({
  value,
  isRevealed,
  onToggle,
}: {
  value: string;
  isRevealed: boolean;
  onToggle: () => void;
}) {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div>
      <Label className="text-gray-500">Value</Label>
      <div className="flex items-center gap-2">
        <p className="flex-1 font-mono">
          {isRevealed ? value : MASKED_VALUE_PLACEHOLDER}
        </p>
        <Button variant="ghost" size="icon" onClick={handleToggleClick}>
          {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

/** Displays tags list */
function TagsList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div>
      <Label className="text-gray-500">Tags</Label>
      <div className="flex flex-wrap gap-2 mt-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/** Displays custom actions section */
function ActionsSection({ children }: { children: React.ReactNode }) {
  if (!children) return null;

  return <div className="pt-2 border-t">{children}</div>;
}

/**
 * Reusable card for displaying key entries
 * Composed of smaller, focused sub-components
 */
export function KeyEntryCard({
  entry,
  isValueRevealed,
  onToggleReveal,
  onClick,
  actions,
  className = "",
}: KeyEntryCardProps) {
  const cardClassName = [
    onClick && "cursor-pointer hover:border-blue-300",
    className,
    "transition-colors",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={cardClassName} onClick={onClick}>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <KeyNameField keyName={entry.key} />
          <SecretValueField
            value={entry.value}
            isRevealed={isValueRevealed}
            onToggle={onToggleReveal}
          />
          <TagsList tags={entry.tags} />
          <ActionsSection>{actions}</ActionsSection>
        </div>
      </CardContent>
    </Card>
  );
}
