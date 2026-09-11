"use client";

import { useQuery } from "@tanstack/react-query";
import type { Status } from "@/types/content";
import { deleteContents, fetchContents, patchContentsStatus } from "@/lib/content-request";
import { contentQueryKeys } from "@/lib/content-query-keys";
import { getOrCreateSessionId } from "@/lib/session-id";
import { useInvalidatingMutation } from "@/hooks/use-invalidating-mutation";

export function useContentQuery() {
  const sessionId = getOrCreateSessionId();

  const query = useQuery({
    queryKey: contentQueryKeys.all(sessionId),
    queryFn: () => fetchContents(sessionId),
  });

  return {
    data: query.data ?? null,
    isLoading: query.isPending,
    isRefetching: query.isFetching && !query.isPending,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? "Unknown error"
          : null,
    refetch: query.refetch,
  };
}

export type BulkAction = "activate" | "archive" | "delete";

export interface BulkContentMutationInput {
  action: BulkAction;
  ids: string[];
}

export function useBulkContentMutation() {
  const sessionId = getOrCreateSessionId();

  return useInvalidatingMutation({
    mutationFn: async ({ action, ids }: BulkContentMutationInput) => {
      if (action === "delete") {
        return deleteContents(sessionId, ids);
      }

      const nextStatus: Status = action === "activate" ? "active" : "inactive";
      return patchContentsStatus(sessionId, ids, nextStatus);
    },
    mutationKey: contentQueryKeys.all(sessionId),
  });
}
