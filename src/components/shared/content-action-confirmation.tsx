import {ConfirmModal} from "@/components/ui/confirm-modal";
import type {BulkAction} from "@/hooks/use-content-query";

const ACTION_COPY: Record<
  BulkAction,
  {
    title: string;
    description: (count: number) => string;
    confirmLabel: string;
    variant: "default" | "danger";
  }
> = {
  activate: {
    title: "Activate selected items",
    description: (count) =>
      `Set ${count.toLocaleString()} selected item${count === 1 ? "" : "s"} to active status?`,
    confirmLabel: "Activate",
    variant: "default",
  },
  archive: {
    title: "Archive selected items",
    description: (count) =>
      `Archive ${count.toLocaleString()} selected item${count === 1 ? "" : "s"}? They will be marked inactive.`,
    confirmLabel: "Archive",
    variant: "default",
  },
  delete: {
    title: "Delete selected items",
    description: (count) =>
      `Permanently delete ${count.toLocaleString()} selected item${count === 1 ? "" : "s"}? This cannot be undone in this session.`,
    confirmLabel: "Delete",
    variant: "danger",
  },
};

interface ContentActionConfirmationProps {
  action: BulkAction | null;
  selectedCount: number;
  loading?: boolean;
  error: string | null;
  onAccept?: () => void;
  onReject?: () => void;
}

export function ContentActionConfirmation({action, selectedCount, loading, error, onAccept, onReject}: ContentActionConfirmationProps) {
  const actionMeta = action ? ACTION_COPY[action] : null;
  if (!actionMeta) {
    return null;
  }
  return (
    <ConfirmModal
      open={action !== null}
      title={actionMeta.title}
      description={actionMeta.description(selectedCount)}
      confirmLabel={actionMeta.confirmLabel}
      variant={actionMeta.variant}
      isPending={loading}
      error={error}
      onConfirm={() => onAccept?.()}
      onCancel={() => onReject?.()}
    />
  );
}