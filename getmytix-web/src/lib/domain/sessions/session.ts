import {Domain, Maybe} from "@/lib/types";
import * as repository from "./repository";
import {cookies} from "next/headers";

export type Session = Domain<repository.SessionRecord>;

export async function createSession(): Promise<Session> {
    console.info("Creating session");

    const currentSessionId = getCurrentSessionId();

    if (currentSessionId) {
        const currentSession = await getSession(currentSessionId);
        if (!currentSession) {
            throw new Error(`Session does not exist for ${currentSessionId}`);
        }

        return currentSession;
    }

    const {_id, ...rest} = await repository.createSession();

    const sessionId = _id.toHexString();

    const cookieStore = cookies();
    cookieStore.set("sessionId", sessionId);

    console.info("Session created", sessionId);

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

    const {_id, ...rest} = session;

    return {
        id: _id.toHexString(),
        ...rest,
    };
}

export async function updateSessionWithCustomer(sessionId: string, customerId: string) {
    console.info("Updating session with customer")
    
    const session = await repository.getSessionById(sessionId);

    if (!session) {
        throw new Error("Trying to update a session that's not present");
    }

    await repository.updateSessionWithCustomer(sessionId, customerId);
}

export function getCurrentSessionId(): string | null {
    const cookieStore = cookies();
    const sessionIdCookie = cookieStore.get("sessionId");

    if (!sessionIdCookie) {
        return null;
    }

    return sessionIdCookie.value;
}
