"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  className,
}) => {
  return (
    <div className={cn("relative w-full lg:max-w-md xl:max-w-sm", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-border bg-muted/70 pl-10 pr-10 font-main text-sm font-medium text-foreground shadow-inner outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:bg-card focus:ring-4 focus:ring-primary/10"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
