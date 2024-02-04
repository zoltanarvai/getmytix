import { Domain, Maybe } from "@/lib/types";
import * as repository from "./repository";
import { cookies } from "next/headers";

export type Session = Domain<repository.SessionRecord>;

export async function createSession(customerId: string): Promise<Session> {
  const { _id, ...rest } = await repository.createSession(customerId);

  const sessionId = _id.toHexString();

  const cookieStore = cookies();
  cookieStore.set("sessionId", sessionId);

  return {
    id: sessionId,
    ...rest,
  };
}

export async function getSession(sessionId: string): Promise<Maybe<Session>> {
  const session = await repository.getSessionById(sessionId);

  if (!session) {
    return null;
  }

  const { _id, ...rest } = session;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export function getCurrentSessionId(): string | null {
  const cookieStore = cookies();
  const sessionIdCookie = cookieStore.get("sessionId");

  if (!sessionIdCookie) {
    return null;
  }

  return sessionIdCookie.value;
}
