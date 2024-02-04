import { getDB } from "@/lib/mongodb";
import { SessionRecord } from "./schema";

export async function createSession(
  customerId: string
): Promise<SessionRecord> {
  try {
    const session = {
      customerId,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    const db = await getDB();
    const document = await db.collection("sessions").insertOne(session);

    return {
      _id: document.insertedId,
      ...session,
    };
  } catch (error) {
    console.error("Could not create session", error);
    throw error;
  }
}
