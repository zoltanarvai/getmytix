import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { TicketStatus } from "./schema";

export async function updateTicket(
  ticketId: string,
  status: TicketStatus,
  ticketUrl?: string
): Promise<void> {
  const db = await getDB();

  await db.collection("tickets").updateOne(
    { _id: new ObjectId(ticketId) },
    {
      $set: {
        status,
        ticketUrl: ticketUrl || "",
        updatedAt: new Date().toUTCString(),
      },
    }
  );
}
