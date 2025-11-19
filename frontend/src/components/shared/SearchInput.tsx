import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  label?: string;
}

/**
 * Reusable search input field with icon
 * Used across: SearchKeys, DeleteKeys, UpdateKey
 */
export function SearchInput({ 
  value, 
  onChange, 
  id = "search",
  placeholder = "Search by key or tag...",
  label = "Search"
}: SearchInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          className="pl-9"
        />
      </div>
    </div>
  );
}
