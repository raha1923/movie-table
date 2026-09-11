import {type ColumnDef, columnSizingFeature, rowSelectionFeature, tableFeatures} from "@tanstack/react-table";
import type {ContentItem} from "@/types/content";
import {Checkbox} from "@/components/ui/checkbox";
import {ContentTableRowMenu} from "@/components/shared/content-table-row-menu";
import {cn} from "@/lib/utils";

export const ContentTableFeatures = tableFeatures({
  rowSelectionFeature,
  columnSizingFeature,
});

export const ContentTableColumns: ColumnDef<typeof ContentTableFeatures, ContentItem, unknown>[] = [
  {
    id: "select",
    size: 48,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(checked) => {
          table.toggleAllRowsSelected(checked === true);
        }}
        aria-label="Select all matching rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          row.toggleSelected(checked === true);
        }}
        aria-label={`Select ${row.original.title}`}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    size: 110,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 320,
    cell: ({ getValue }) => (
      <span className="block truncate font-medium text-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 140,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ getValue }) => {
      const status = getValue<"active" | "inactive">();
      return (
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize",
            status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-zinc-100 text-zinc-600",
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "views",
    header: "Views",
    size: 120,
    cell: ({ getValue }) => (
      <span className="tabular-nums">
        {getValue<number>().toLocaleString()}
      </span>
    ),
  },
  {
    id: "options",
    size: 64,
    header: () => <span className="sr-only">Row actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ContentTableRowMenu item={row.original} />
      </div>
    ),
  },
];
