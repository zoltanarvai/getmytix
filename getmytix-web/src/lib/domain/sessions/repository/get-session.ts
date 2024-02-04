import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { SessionRecord, sessionSchema } from "./schema";

export async function getSessionById(
  sessionId: string
): Promise<SessionRecord> {
  try {
    const db = await getDB();
    const document = await db.collection("sessions").findOne({
      _id: ObjectId.createFromHexString(sessionId),
    });

    if (!document) {
      throw new Error("No such session found");
    }

    return sessionSchema.parse({
      ...document,
    });
  } catch (error) {
    console.error("Could not retrieve session", error);
    throw error;
  }
}
