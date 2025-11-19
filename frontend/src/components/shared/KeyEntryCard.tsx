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

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
import { KeyEntry } from "../../types";
import { MASKED_VALUE_PLACEHOLDER } from "../../constants";

interface KeyEntryCardProps {
  entry: KeyEntry;
  isValueRevealed: boolean;
  onToggleReveal: () => void;
  onClick?: () => void;
  actions?: React.ReactNode; // Flexible action buttons
  className?: string;
}

/**
 * Reusable card for displaying key entries
 * Used in Search, Update, and Delete views with different actions
 */
export function KeyEntryCard({
  entry,
  isValueRevealed,
  onToggleReveal,
  onClick,
  actions,
  className = "",
}: KeyEntryCardProps) {
  return (
    <Card
      className={`${onClick ? "cursor-pointer hover:border-blue-300" : ""} ${className} transition-colors`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Key Name */}
          <div>
            <Label className="text-gray-500">Key</Label>
            <p>{entry.key}</p>
          </div>

          {/* Value with Toggle */}
          <div>
            <Label className="text-gray-500">Value</Label>
            <div className="flex items-center gap-2">
              <p className="flex-1 font-mono">
                {isValueRevealed ? entry.value : MASKED_VALUE_PLACEHOLDER}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReveal();
                }}
              >
                {isValueRevealed ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div>
              <Label className="text-gray-500">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom Actions */}
          {actions && <div className="pt-2 border-t">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
