"use client";

import {Archive, CheckCircle2, Ellipsis, Trash2} from "lucide-react";
import type {BulkAction} from "@/hooks/use-content-query";
import type {ContentItem} from "@/types/content";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";

interface ContentTableRowMenuProps {
  item: ContentItem;
  onActionClick?: (action: BulkAction, item: ContentItem) => void;
}

export function ContentTableRowMenu({item, onActionClick}: ContentTableRowMenuProps) {
  const actions: Array<{
    action: BulkAction;
    label: string;
    Icon: typeof CheckCircle2;
  }> = item.status === "active"
    ? [
        {action: "archive", label: "Archive", Icon: Archive},
        {action: "delete", label: "Delete", Icon: Trash2},
      ]
    : [
        {action: "activate", label: "Activate", Icon: CheckCircle2},
        {action: "delete", label: "Delete", Icon: Trash2},
      ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Open actions for ${item.title}`}
          className="size-8 rounded-md text-muted hover:bg-zinc-100 hover:text-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          <Ellipsis className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {actions.map(({action, label, Icon}) => (
          <DropdownMenuItem
            key={action}
            onSelect={(event) => {
              event.preventDefault();
              onActionClick?.(action, item);
            }}
            className={cn(
              "gap-2",
              action === "delete" && "text-red-600 focus:text-red-600",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}