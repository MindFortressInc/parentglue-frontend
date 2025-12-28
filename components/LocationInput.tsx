"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8004";

interface LocationSuggestion {
  city: string;
  state: string;
  state_name: string;
  population: number;
  zip?: string;
}

export interface SelectedLocation {
  city: string;
  state: string;
  stateName: string;
  display: string;
}

interface LocationInputProps {
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation | null) => void;
  placeholder?: string;
  className?: string;
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Enter city or state...",
  className = "",
}: LocationInputProps) {
  const [query, setQuery] = useState(value?.display || "");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Search cities via API
  const searchLocations = useCallback((q: string) => {
    // Clear pending requests
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (q.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();
      try {
        const res = await fetch(
          `${API_URL}/api/locations/autocomplete?q=${encodeURIComponent(q)}&limit=8`,
          { signal: abortControllerRef.current.signal }
        );
        if (!res.ok) throw new Error("API error");
        const data: LocationSuggestion[] = await res.json();
        setSuggestions(data);
        setIsOpen(data.length > 0);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setSuggestions([]);
          setIsOpen(false);
        }
      } finally {
        setIsLoading(false);
      }
    }, 150);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (value && newQuery !== value.display) {
      onChange(null);
    }

    searchLocations(newQuery);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: LocationSuggestion) => {
    const selected: SelectedLocation = {
      city: suggestion.city,
      state: suggestion.state,
      stateName: suggestion.state_name,
      display: `${suggestion.city}, ${suggestion.state}`,
    };
    setQuery(selected.display);
    onChange(selected);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Sync query with value prop
  useEffect(() => {
    if (value?.display && value.display !== query) {
      setQuery(value.display);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.display]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input with icon */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-charcoal-light)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-10 rounded-xl border-2 border-[var(--color-cream-dark)] bg-white text-[var(--color-charcoal)] placeholder:text-[var(--color-charcoal-light)] focus:border-[var(--color-teal)] focus:outline-none transition-colors"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-charcoal-light)] animate-spin" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-[var(--color-cream-dark)] rounded-xl shadow-[var(--shadow-medium)] overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.city}-${suggestion.state}-${suggestion.zip || index}`}
              type="button"
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                highlightedIndex === index
                  ? "bg-[var(--color-teal)]/10"
                  : "hover:bg-[var(--color-cream)]"
              }`}
            >
              <MapPin className="w-4 h-4 text-[var(--color-charcoal-light)] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--color-charcoal)]">
                  {suggestion.city}, {suggestion.state}
                </div>
                <div className="text-xs text-[var(--color-charcoal-light)]">
                  {suggestion.state_name}
                </div>
              </div>
              {suggestion.population > 500000 && (
                <span className="text-xs text-[var(--color-charcoal-light)] bg-[var(--color-cream)] px-2 py-0.5 rounded-full">
                  {(suggestion.population / 1000000).toFixed(1)}M
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
