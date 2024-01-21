import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

export function getSessionId(): string | null {
  const cookieStore = cookies();
  const sessionIdCookie = cookieStore.get("sessionId");

  if (!sessionIdCookie) {
    return null;
  }

  return sessionIdCookie.value;
}

export function createSessionId(): string {
  const sessionId = uuid();
  const cookieStore = cookies();
  cookieStore.set("sessionId", sessionId);

  return sessionId;
}
