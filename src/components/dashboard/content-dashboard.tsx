"use client";

import { useCallback, useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/table-core";
import { Loader2 } from "lucide-react";
import type { ContentItem } from "@/types/content";
import {
  type BulkAction,
  useBulkContentMutation,
  useContentQuery,
} from "@/hooks/use-content-query";
import { useTableFilters } from "@/hooks/use-table-filters";
import { FilterToolbar } from "@/components/dashboard/filter-toolbar";
import { DataTable } from "@/components/dashboard/data-table";
import { ContentActionConfirmation } from "@/components/shared/content-action-confirmation";
import { FloatingActionBar } from "@/components/shared/floating-action-bar";
import { filterContents, getSelectedIds } from "@/lib/content-helpers";

export function ContentDashboard() {
  const { data, isLoading, error } = useContentQuery();
  const bulkMutation = useBulkContentMutation();
  const [filters, setFilters] = useTableFilters();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [pendingAction, setPendingAction] = useState<{
    type: BulkAction;
    targetIds: string[];
  } | null>(null);

  const filteredData = useMemo(
    () => filterContents(data, filters),
    [data, filters]
  );

  const selectedIds = useMemo(
    () => getSelectedIds(rowSelection, filteredData),
    [filteredData, rowSelection]
  );

  const selectedCount = selectedIds.length;

  const mutationError = useMemo(() => {
    if (!bulkMutation.error) return null;
    return bulkMutation.error instanceof Error
      ? bulkMutation.error.message
      : "Action failed";
  }, [bulkMutation.error]);

  const closeModal = useCallback(() => {
    if (bulkMutation.isPending) return;

    bulkMutation.reset();
    setPendingAction(null);
  }, [bulkMutation]);

  const handleConfirm = useCallback(async () => {
    if (!pendingAction || pendingAction.targetIds.length === 0) return;

    try {
      await bulkMutation.mutateAsync({
        action: pendingAction.type,
        ids: pendingAction.targetIds,
      });

      setRowSelection({});
      setPendingAction(null);
      bulkMutation.reset();
    } catch {
      // Error state handled & rendered via bulkMutation.error
    }
  }, [bulkMutation, pendingAction]);

  const handleBulkActionClick = useCallback(
    (action: BulkAction) => {
      if (selectedIds.length === 0) return;
      bulkMutation.reset();
      setPendingAction({ type: action, targetIds: selectedIds });
    },
    [bulkMutation, selectedIds]
  );

  const handleRowAction = useCallback(
    (row: ContentItem, action: BulkAction) => {
      bulkMutation.reset();
      setPendingAction({ type: action, targetIds: [row.id] });
    },
    [bulkMutation]
  );

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl min-h-0 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <p className="text-sm font-medium text-accent">Content Library</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Analytical Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          Browse 1,200 session-stable mock items with URL-synced filters and a
          virtualized multi-select table.
        </p>
      </header>

      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        loading={isLoading}
        totalCount={data?.length}
        filteredCount={filteredData.length}
      />

      {isLoading && (
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface py-24 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading content…
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          Failed to load contents: {error}
        </div>
      )}

      {!isLoading && !error && (
        <DataTable
          data={filteredData}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowAction={handleRowAction}
        />
      )}

      <FloatingActionBar
        selectedCount={selectedCount}
        onActionClick={handleBulkActionClick}
      />

      <ContentActionConfirmation
        action={pendingAction?.type ?? null}
        selectedCount={pendingAction?.targetIds.length ?? 0}
        loading={bulkMutation.isPending}
        error={mutationError}
        onAccept={handleConfirm}
        onReject={closeModal}
      />
    </div>
  );
}
