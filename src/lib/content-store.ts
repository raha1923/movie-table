// TO_KNOW: this is just for the presentation purposes, not for real-world cases

import { generateMockContents } from "@/lib/mock-data";
import type { ContentItem, Status } from "@/types/content";

const sessions = new Map<string, ContentItem[]>();

function ensureSession(sessionId: string): ContentItem[] {
  const existing = sessions.get(sessionId);
  if (existing) return existing;

  const generated = generateMockContents(sessionId);
  sessions.set(sessionId, generated);
  return generated;
}

export function getContents(sessionId: string): ContentItem[] {
  return [...ensureSession(sessionId)];
}

export function updateContentsStatus(
  sessionId: string,
  ids: string[],
  status: Status,
): { updated: number } {
  const items = ensureSession(sessionId);
  const idSet = new Set(ids.filter(Boolean));
  let updated = 0;

  for (const item of items) {
    if (!idSet.has(item.id)) continue;
    if (item.status !== status) {
      item.status = status;
    }
    updated += 1;
  }

  return { updated };
}

export function deleteContents(
  sessionId: string,
  ids: string[],
): { deleted: number } {
  const items = ensureSession(sessionId);
  const idSet = new Set(ids.filter(Boolean));
  const remaining = items.filter((item) => !idSet.has(item.id));
  const deleted = items.length - remaining.length;

  sessions.set(sessionId, remaining);
  return { deleted };
}
