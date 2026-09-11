import {NextRequest} from "next/server";
import {type Status, STATUSES} from "@/types/content";
import {updateContentsStatus} from "@/lib/content-store";
import {parseIds, requireSessionId} from "@/lib/validations/content";

export async function contentBulkUpdate(request: NextRequest) {
  const sessionId = requireSessionId(request);
  if (sessionId instanceof Response) return sessionId;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ids = parseIds(body);
  if (!ids) {
    return Response.json(
      { error: "Body must include a non-empty ids string array" },
      { status: 400 },
    );
  }

  const status =
    body && typeof body === "object" && "status" in body
      ? (body as { status: unknown }).status
      : undefined;

  if (typeof status !== "string" || !STATUSES.includes(status as Status)) {
    return Response.json(
      { error: 'status must be "active" or "inactive"' },
      { status: 400 },
    );
  }

  const result = updateContentsStatus(sessionId, ids, status as Status);
  return Response.json(result);
}