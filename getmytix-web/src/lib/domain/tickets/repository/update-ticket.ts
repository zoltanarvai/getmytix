import { getDB } from "@/lib/mongodb";
import { TicketRecord } from "./schema";
import { ObjectId } from "mongodb";

export async function updateTicket(
  ticketId: string,
  status: TicketRecord["status"]
): Promise<void> {
  const db = await getDB();

  await db.collection("tickets").updateOne(
    { _id: new ObjectId(ticketId) },
    {
      $set: {
        status,
        updatedAt: new Date().toUTCString(),
      },
    }
  );
}
