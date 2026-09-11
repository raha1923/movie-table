import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {createSessionId, SESSION_KEY} from "@/lib/session-id";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(SESSION_KEY)?.value;

  if (!existing) {
    response.cookies.set(SESSION_KEY, createSessionId(), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
