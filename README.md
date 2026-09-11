# Content Dashboard

High-performance analytical content dashboard built with **Next.js App Router**. It demonstrates a clean frontend architecture with URL-driven filters, TanStack Query data flow, a virtualized table, and reusable shadcn-style UI primitives.

## Features

- **Deterministic session mock data** — `/api/contents` generates 1,200 items with `@faker-js/faker`, seeded from a `sessionId` hash so refreshes in the same browser tab return an identical base dataset.
- **Session-scoped content store** — generated data is cached in-memory per `sessionId`; bulk actions mutate the store so subsequent fetches reflect updated state.
- **URL-synced filters** — search (`q`), `category`, and `status` are bound with [nuqs](https://nuqs.dev) using `history: 'replace'` and `clearOnDefault: true`.
- **Debounced search** — local input updates instantly; the URL updates after 300ms via `use-debounce`.
- **React Query data layer** — all content reads and bulk mutations are handled through TanStack Query with explicit query keys and invalidation.
- **Virtualized table** — `@tanstack/react-table` v9 + `@tanstack/react-virtual` render a fixed-height row grid without pagination.
- **Bulk selection + action flow** — select rows, trigger activate/archive/delete, confirm in a modal, and invalidate the content query.
- **Modern UI primitives** — shadcn-style `Input`, `Button`, `Select`, `Checkbox`, and `AlertDialog` components built on Radix primitives.

## Architecture

```
src/
  app/
    layout.tsx              # Root layout + NuqsAdapter + React Query provider
    page.tsx                # Redirects → /dashboard
    dashboard/page.tsx      # Dashboard route with Suspense boundary for nuqs
    api/contents/route.ts   # GET / PATCH / DELETE contents API
  components/
    dashboard/
      content-dashboard.tsx # Dashboard orchestration and bulk actions
      filter-toolbar.tsx    # Debounced search + filter controls
      data-table.tsx        # Virtualized TanStack table
    providers/
      react-query-provider.tsx # QueryClientProvider
    shared/
      content-action-confirmation.tsx
      floating-action-bar.tsx
    ui/
      alert-dialog.tsx      # shadcn-style dialog primitives
      button.tsx            # shadcn-style button primitives
      checkbox.tsx          # shadcn-style checkbox primitives
      confirm-modal.tsx     # Modal wrapper over AlertDialog
      input.tsx             # shadcn-style input primitives
      select.tsx            # shadcn-style select primitives
  hooks/
    use-content-query.ts    # TanStack Query fetch + mutation hooks
    use-table-filters.ts    # nuqs filter state
  lib/
    content-request.ts     # client HTTP wrapper for GET/PATCH/DELETE
    content-store.ts       # in-memory per-session dataset
    mock-data.ts           # hashSeed + generateMockContents
    utils.ts               # cn() helper
  types/
    content.ts             # domain contracts
```

## Data flow

1. The root layout mounts `ReactQueryProvider` to enable QueryClient state across the app.
2. `useContentQuery()` calls the content endpoint via TanStack Query and caches the dataset by key.
3. `useBulkContentMutation()` handles activate/archive/delete mutations and calls `queryClient.invalidateQueries()` after success.
4. `ContentDashboard` handles only UI orchestration: selection, modal state, and action triggers.

### REST API contract

All routes require `?sessionId=`.

| Method | Path | Body | Result |
|--------|------|------|--------|
| `GET` | `/api/contents` | — | `ContentItem[]` |
| `PATCH` | `/api/contents` | `{ ids: string[], status: "active" \| "inactive" }` | `{ updated: number }` |
| `DELETE` | `/api/contents` | `{ ids: string[] }` | `{ deleted: number }` |

Dashboard mapping:

- **Activate** → `PATCH` with `status: "active"`
- **Archive** → `PATCH` with `status: "inactive"`
- **Delete** → `DELETE` with selected ids

Missing `sessionId`, empty/invalid `ids`, or invalid `status` → `400`.

## Performance decisions

| Concern | Approach |
|--------|----------|
| Large lists | Virtualized rows with fixed 48px height and `translateY` positioning |
| Data fetching | TanStack Query cache + invalidation instead of manual refetch side effects |
| Typing | Debounced search before URL writes |
| History | Always `replace` for filter updates |
| Empty filters | Strip query params entirely |
| Selection | TanStack row-selection state over the filtered dataset |
| Bulk actions | Confirm modal → mutation → query invalidation |

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/dashboard`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Manual verification checklist

1. Refresh `/dashboard` — item titles and IDs stay stable for the session.
2. Type in search — URL `q` updates after ~300ms with no back-stack spam.
3. Reset Filters — query string is removed and the UI returns to the default list view.
4. Open a URL like `/dashboard?category=Movies&status=active` — the toolbar and table remain in sync.
5. Select rows and bulk-action them — selection clears after success, and the dataset refreshes automatically.
6. Scroll through the table — virtualization remains smooth, even with large filtered sets.
