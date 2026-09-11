import type { ContentItem, Status } from "@/types/content";
import { getOrCreateSessionId } from "@/lib/session-id";

async function readError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? `Request failed (${response.status})`;
}

export async function fetchContents(
  sessionIdOverride?: string,
): Promise<ContentItem[]> {
  const sessionId = sessionIdOverride ?? getOrCreateSessionId();
  const response = await fetch(
    `/api/contents?sessionId=${encodeURIComponent(sessionId)}`,
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(
      body?.error ?? `Failed to load contents (${response.status})`,
    );
  }

  return (await response.json()) as ContentItem[];
}

export async function patchContentsStatus(
  sessionId: string,
  ids: string[],
  status: Status,
): Promise<{ updated: number }> {
  const response = await fetch(
    `/api/contents?sessionId=${encodeURIComponent(sessionId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as { updated: number };
}

export async function deleteContents(
  sessionId: string,
  ids: string[],
): Promise<{ deleted: number }> {
  const response = await fetch(
    `/api/contents?sessionId=${encodeURIComponent(sessionId)}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as { deleted: number };
}
