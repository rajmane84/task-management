"use client"

import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
};

// Future improvements: Add debouncing

export const SearchBar = ({ value = "", onChange }: SearchBarProps) => {
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
  };

  const clearSearch = () => {
    setQuery("");
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search tasks, projects…"
        className={cn(
          "h-9 w-full rounded-md bg-neutral-800 pl-9 pr-9 text-sm text-white",
          "ring-1 ring-white/10 outline-none placeholder:text-white/40",
          "transition-all focus:ring-2 focus:ring-blue-500"
        )}
      />

      {query !== "" && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/40 hover:text-white transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
