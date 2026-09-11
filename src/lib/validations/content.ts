import {NextRequest} from "next/server";

export function requireSessionId(request: NextRequest): string | Response {
  const sessionId = request.nextUrl.searchParams.get("sessionId")?.trim();

  if (!sessionId) {
    return Response.json(
      { error: "Missing required query parameter: sessionId" },
      { status: 400 },
    );
  }

  return sessionId;
}

export function parseIds(body: unknown): string[] | null {
  if (!body || typeof body !== "object" || !("ids" in body)) {
    return null;
  }

  const ids = (body as { ids: unknown }).ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return null;
  }

  const normalizedIds = ids
    .map((id) => (typeof id === "string" ? id.trim() : ""))
    .filter((id) => id.length > 0);

  if (normalizedIds.length === 0 || normalizedIds.length !== new Set(normalizedIds).size) {
    return null;
  }

  return normalizedIds;
}