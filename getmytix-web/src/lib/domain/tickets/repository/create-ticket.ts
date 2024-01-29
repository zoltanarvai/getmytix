import { getDB } from "@/lib/mongodb";
import { TicketRecord } from "./schema";

export async function createTicket(
  ticket: Omit<TicketRecord, "_id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = await getDB();

  const { insertedId } = await db.collection("tickets").insertOne({
    ...ticket,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  });

  return insertedId.toHexString();
}
