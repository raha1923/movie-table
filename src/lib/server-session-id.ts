// TO_KNOW: this is just for the presentation purposes, not for real-world cases

import { cookies } from "next/headers";
import {SESSION_KEY} from "@/lib/session-id";


export async function getServerSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_KEY)?.value ?? null;
}
