"use client"

import { useState, useEffect } from "react"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PermissionSearchProps {
  onSearch: (query: string) => void
  onFilterChange?: (filters: string[]) => void
  availableCategories?: string[]
  resultCount?: number
}

export function PermissionSearch({
  onSearch,
  onFilterChange,
  availableCategories = [],
  resultCount
}: PermissionSearchProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(debounce)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className="space-y-3">
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused && "ring-2 ring-forest-green-500/30"
      )}>
        <Search className={cn(
          "absolute left-3 w-5 h-5 transition-colors",
          isFocused ? "text-forest-green-500" : "text-muted-foreground"
        )} />
        <Input
          placeholder="Search permissions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-20 bg-muted/30 border-border/60 focus:bg-background"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {availableCategories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              showFilters 
                ? "bg-forest-green-100 text-forest-green-700 dark:bg-forest-green-900/40 dark:text-forest-green-300" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              {availableCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}

          {resultCount !== undefined && query && (
            <span className="text-xs text-muted-foreground ml-auto">
              {resultCount} results
            </span>
          )}
        </div>
      )}
    </div>
  )
}