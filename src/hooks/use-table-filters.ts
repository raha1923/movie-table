"use client";

import {
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { CATEGORIES, STATUSES } from "@/types/content";

const filterParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsStringLiteral(CATEGORIES),
  status: parseAsStringLiteral(STATUSES),
};

export function useTableFilters() {
  return useQueryStates(filterParsers, {
    history: "replace",
    clearOnDefault: true,
  });
}

export type TableFilters = ReturnType<typeof useTableFilters>[0];
export type SetTableFilters = ReturnType<typeof useTableFilters>[1];
