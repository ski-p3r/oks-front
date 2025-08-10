"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/axios";
import { toast } from "sonner";

interface TagType {
  id: number;
  name: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({
  selectedTags,
  onChange,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = searchQuery ? `?search=${searchQuery}` : "";
        const url = `${API_BASE_URL}/stories/tags${query}`;
        console.log("Fetching tags from:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Fetch tags failed:",
            response.status,
            response.statusText,
            errorText
          );
          throw new Error(
            `Failed to fetch tags: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched tags:", data.results);
        setAvailableTags(data.results || []);
      } catch (error: any) {
        console.error("Error fetching tags:", error.message);
        setError(
          "Unable to load tags. Please try again later or contact support."
        );
        setAvailableTags([]);
        toast.error("Failed to load tags. You can still submit without tags.");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTags();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelect = (value: string) => {
    if (selectedTags.includes(value)) {
      onChange(selectedTags.filter((tag) => tag !== value));
    } else {
      onChange([...selectedTags, value]);
    }
  };

  const handleRemove = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag));
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
          >
            Select tags
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              onValueChange={handleSearchInputChange}
              className="tag-search-input"
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading tags...
                  </span>
                </div>
              ) : error ? (
                <div className="p-4 text-sm text-destructive">{error}</div>
              ) : (
                <>
                  <CommandEmpty>
                    {searchQuery
                      ? "No tags found for your search."
                      : "No tags available."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => handleSelect(tag.name)}
                        className="tag-item"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag.name)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
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
