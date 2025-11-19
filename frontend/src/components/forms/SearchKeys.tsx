import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff, Search } from "lucide-react";
import { Button } from "../ui/button";
import { KeyEntry } from "../../types";

interface SearchKeysProps {
  entries: KeyEntry[];
}

export function SearchKeys({ entries }: SearchKeysProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedValues, setRevealedValues] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
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

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Search Keys</CardTitle>
        <CardDescription>Search by key name or tags</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="search"
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
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-500">Key</Label>
                        <p>{entry.key}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Value</Label>
                        <div className="flex items-center gap-2">
                          <p className="flex-1 font-mono">
                            {revealedValues.has(entry.id) ? entry.value : "•".repeat(12)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleReveal(entry.id)}
                          >
                            {revealedValues.has(entry.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
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
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
