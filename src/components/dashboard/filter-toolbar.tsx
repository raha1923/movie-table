"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, STATUSES } from "@/types/content";
import type { SetTableFilters, TableFilters } from "@/hooks/use-table-filters";

interface FilterToolbarProps {
  filters: TableFilters;
  setFilters: SetTableFilters;
  loading?: boolean;
  totalCount?: number;
  filteredCount: number;
}

export function FilterToolbar({
  filters,
  setFilters,
  loading,
  filteredCount,
  totalCount,
}: FilterToolbarProps) {
  const [localSearch, setLocalSearch] = useState(filters.q ?? "");

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    void setFilters({ q: value });
  }, 300);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    debouncedSetQuery(value);
  }

  function handleReset() {
    debouncedSetQuery.cancel();
    setLocalSearch("");
    void setFilters({
      q: "",
      category: null,
      status: null,
    });
  }

  function handleCategoryChange(value: string) {
    void setFilters({
      category: value === "all" ? null : (value as (typeof CATEGORIES)[number]),
    });
  }

  function handleStatusChange(value: string) {
    void setFilters({
      status: value === "all" ? null : (value as (typeof STATUSES)[number]),
    });
  }

  const hasActiveFilters =
    Boolean(filters.q) || filters.category !== null || filters.status !== null;

  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Search titles</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by title…"
            aria-label="Search titles"
            className="pl-9"
          />
        </label>

        <div className="flex flex-col gap-1 text-xs font-medium text-muted">
          <span className="sr-only">Category</span>
          <Select
            value={filters.category ?? "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-10 min-w-[160px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 text-xs font-medium text-muted">
          <span className="sr-only">Status</span>
          <Select
            value={filters.status ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-10 min-w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          size="default"
          disabled={!hasActiveFilters}
          className="h-10 gap-2"
        >
          <RotateCcw className="size-4" aria-hidden />
          Reset Filters
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span>
          Showing{" "}
          <strong className="font-semibold text-foreground">
            {filteredCount.toLocaleString()}
          </strong>
          {totalCount ? ` of ${totalCount.toLocaleString()}` : ""} items
        </span>
        {loading && (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" aria-hidden />
            Refreshing…
          </span>
        )}
      </div>
    </section>
  );
}
