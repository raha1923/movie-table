import {NextRequest} from "next/server";
import {deleteContents} from "@/lib/content-store";
import {parseIds, requireSessionId} from "@/lib/validations/content";

export async function contentBulkDelete(request: NextRequest) {
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

  const result = deleteContents(sessionId, ids);
  return Response.json(result);
}