"use client";

import { Loader2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmModalVariant = "default" | "danger";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: ConfirmModalVariant;
  isPending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  variant = "default",
  isPending = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {

  function handleClose(nextOpen: boolean) {
    if (!nextOpen && !isPending) {
      onCancel();
    }
  }

  function handleConfirm() {
    if (!isPending) {
      onConfirm();
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleClose}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted transition hover:bg-zinc-100 hover:text-foreground disabled:opacity-40"
              onClick={onCancel}
              disabled={isPending}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </AlertDialogHeader>

        {!!error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <AlertDialogFooter className="mt-2 gap-2 sm:gap-2">
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            type="button"
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            className={cn("min-w-[110px]", isPending && "pointer-events-none")}
          >
            {isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
