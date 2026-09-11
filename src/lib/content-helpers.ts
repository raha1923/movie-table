import type {RowSelectionState} from "@tanstack/table-core";
import type {ContentItem} from "@/types/content";
import {useTableFilters} from "@/hooks/use-table-filters";

export function filterContents(
  items: ContentItem[] | null,
  filters: ReturnType<typeof useTableFilters>[0],
) {
  if (!items) return [];

  const query = filters.q.trim().toLowerCase();

  return items.filter((item) => {
    if (query && !item.title.toLowerCase().includes(query)) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export function getSelectedIds(
  rowSelection: RowSelectionState,
  items: ContentItem[],
): string[] {
  const itemIds = new Set(items.map((item) => item.id));

  return Object.keys(rowSelection).filter(
    (id) => rowSelection[id] && itemIds.has(id),
  );
}