// TO_KNOW: this is just for the presentation purposes, not for real-world cases

export const SESSION_KEY = "dashboard_session_id";

export const DEFAULT_SESSION_ID = "dashboard-default-session";

export function createSessionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readCookieSessionId(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_KEY}=`));

  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function writeCookieSessionId(sessionId: string) {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_KEY}=${encodeURIComponent(sessionId)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${secure}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_SESSION_ID;
  }

  const existing = sessionStorage.getItem(SESSION_KEY) ?? readCookieSessionId();
  const nextSessionId = existing?.trim() ? existing.trim() : createSessionId();

  if (nextSessionId !== existing) {
    sessionStorage.setItem(SESSION_KEY, nextSessionId);
    writeCookieSessionId(nextSessionId);
    return nextSessionId;
  }

  sessionStorage.setItem(SESSION_KEY, nextSessionId);
  writeCookieSessionId(nextSessionId);
  return nextSessionId;
}