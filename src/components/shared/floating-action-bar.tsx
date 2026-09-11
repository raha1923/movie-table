import {cn} from "@/lib/utils";
import {Archive, CheckCircle2, Trash2} from "lucide-react";
import {BulkAction} from "@/hooks/use-content-query";

interface FloatingActionBarProps {
  selectedCount: number;
  onActionClick?: (action: BulkAction) => void;
}

export function FloatingActionBar({selectedCount, onActionClick}: FloatingActionBarProps) {
  if (!selectedCount || selectedCount < 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4",
        "rounded-full border border-border bg-zinc-900 px-5 py-3 text-sm text-white shadow-lg",
      )}
      role="status"
    >
      <span className="font-medium tabular-nums">
        {selectedCount.toLocaleString()} selected
      </span>
      <div className="h-4 w-px bg-white/20" aria-hidden />
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-white/10"
        onClick={() => {
          onActionClick?.("activate");
        }}
      >
        <CheckCircle2 className="size-4" aria-hidden />
        Activate
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-white/10"
        onClick={() => {
          onActionClick?.("archive");
        }}
      >
        <Archive className="size-4" aria-hidden />
        Archive
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-red-300 transition hover:bg-white/10"
        onClick={() => {
          onActionClick?.("delete");
        }}
      >
        <Trash2 className="size-4" aria-hidden />
        Delete
      </button>
    </div>
  );
}