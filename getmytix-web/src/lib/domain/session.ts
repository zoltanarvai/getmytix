import { z } from "zod";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getDB } from "../mongodb";
import { Domain } from "../types";

const sessionSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.string(),
  sessionStart: z.string(),
});

type Session = z.infer<typeof sessionSchema>;

export function getSessionId(): string | null {
  const cookieStore = cookies();
  const sessionIdCookie = cookieStore.get("sessionId");

  if (!sessionIdCookie) {
    return null;
  }

  return sessionIdCookie.value;
}

export async function createSessionId(userId: string): Promise<string> {
  try {
    const session = {
      userId,
      sessionStart: new Date().toUTCString(),
    };

    const db = await getDB();
    const document = await db.collection("sessions").insertOne(session);
    const sessionId = document.insertedId.toHexString();

    const cookieStore = cookies();
    cookieStore.set("sessionId", sessionId);

    return sessionId;
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}

export async function getSession(sessionId: string): Promise<Domain<Session>> {
  try {
    const db = await getDB();
    const document = await db.collection("sessions").findOne({
      _id: ObjectId.createFromHexString(sessionId),
    });

    if (!document) {
      throw new Error("No such session found");
    }

    const { _id, ...rest } = sessionSchema.parse({
      ...document,
    });

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (error) {
    console.error("Could not retrieve session", error);
    throw error;
  }
}
