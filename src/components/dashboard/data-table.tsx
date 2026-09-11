"use client";

import { useMemo, useRef } from "react";
import { useTable } from "@tanstack/react-table";
import type { OnChangeFn, RowSelectionState } from "@tanstack/table-core";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { BulkAction } from "@/hooks/use-content-query";
import type { ContentItem } from "@/types/content";
import { ContentTableRowMenu } from "@/components/shared/content-table-row-menu";
import { cn } from "@/lib/utils";
import { ContentTableColumns, ContentTableFeatures } from "@/constants/content-table";

const ROW_HEIGHT = 48;

interface DataTableProps {
  data: ContentItem[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onRowAction?: (row: ContentItem, action: BulkAction) => void;
}

export function DataTable({
  data,
  rowSelection,
  onRowSelectionChange,
  onRowAction,
}: DataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    return ContentTableColumns.map((column) => {
      if (column.id !== "options") return column;

      return {
        ...column,
        cell: ({ row }: { row: { original: ContentItem } }) => (
          <div className="flex justify-end">
            <ContentTableRowMenu
              item={row.original}
              onActionClick={(action) => onRowAction?.(row.original, action)}
            />
          </div>
        ),
      };
    });
  }, [onRowAction]);

  const gridTemplateColumns = useMemo(
    () => ContentTableColumns.map((c) => `${c.size ?? 120}px`).join(" ") + " 1fr",
    []
  );

  const table = useTable<typeof ContentTableFeatures, ContentItem>({
    data,
    columns,
    features: ContentTableFeatures,
    state: { rowSelection },
    onRowSelectionChange,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const { rows } = table.getRowModel();

  // TanStack Virtual intentionally returns callback factories, which the React
  // hooks compatibility lint flags as a false positive. Use it directly so the
  // virtualized table remains stable and the warning stays scoped to this
  // documented library contract.
  // eslint-disable-next-line react-hooks/incompatible-library -- false positive for TanStack Virtual hook API
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div
        ref={parentRef}
        className="min-h-0 flex-1 overflow-auto"
        style={{ height: "100%" }}
        role="region"
        aria-label="Content table"
      >
        <div className="min-w-[720px]">
          <div
            className="sticky top-0 z-10 grid border-b border-border bg-zinc-50/95 backdrop-blur"
            style={{ gridTemplateColumns }}
          >
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="flex h-11 items-center px-3 text-[11px] font-semibold uppercase tracking-wide text-muted"
                  style={{ width: header.getSize() }}
                >
                  {!header.isPlaceholder && (
                    <table.FlexRender header={header} />
                  )}
                </div>
              ))
            )}
          </div>

          {rows.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted">
              No items match the current filters.
            </div>
          ) : (
            <div className="relative w-full" style={{ height: `${totalSize}px` }}>
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) return null;

                return (
                  <div
                    key={row.id}
                    data-index={virtualRow.index}
                    className={cn(
                      "absolute left-0 top-0 grid w-full border-b border-border/70 transition-colors",
                      row.getIsSelected() ? "bg-accent-soft" : "bg-surface",
                      "hover:bg-zinc-50"
                    )}
                    style={{
                      height: `${ROW_HEIGHT}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      gridTemplateColumns,
                    }}
                  >
                    {row.getAllCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="flex min-w-0 items-center overflow-hidden px-3 text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
