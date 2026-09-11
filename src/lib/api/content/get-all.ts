import {NextRequest} from "next/server";
import {getContents} from "@/lib/content-store";
import {requireSessionId} from "@/lib/validations/content";

export function getAllContents(request: NextRequest, ) {
  const sessionId = requireSessionId(request);
  if (sessionId instanceof Response) return sessionId;

  return Response.json(getContents(sessionId));
}