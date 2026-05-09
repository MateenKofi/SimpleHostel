import React, { useState, useRef } from "react";
import { Search, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResult } from "./map-utils";

interface SearchLocationProps {
  onResultSelect: (result: SearchResult) => void;
  onUseMyLocation: () => void;
}

export function SearchLocation({ onResultSelect, onUseMyLocation }: SearchLocationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=gh&limit=5`,
        { signal: controller.signal, headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Search failed");
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setSearchResults([]);
    setSearchQuery(result.display_name);
    onResultSelect(result);
  };

  return (
    <div className="relative z-10 w-full mb-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for your hostel location..."
            className="pl-8 bg-background shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={onUseMyLocation} title="Use my current location">
          <Navigation className="h-4 w-4" />
        </Button>
      </form>

      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-auto z-20">
          {searchResults.map((result) => (
            <li
              key={result.place_id}
              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer line-clamp-2 border-b last:border-0"
              onClick={() => handleSelect(result)}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
