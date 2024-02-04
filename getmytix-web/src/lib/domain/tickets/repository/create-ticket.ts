import { getDB } from "@/lib/mongodb";
import { CreateTicket, TicketRecord, createTicketSchema } from "./schema";

export async function createTicket(
  ticket: CreateTicket
): Promise<TicketRecord> {
  const ticketRecord = {
    ...createTicketSchema.parse(ticket),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  const db = await getDB();

  const { insertedId } = await db.collection("tickets").insertOne(ticketRecord);

  return {
    ...ticketRecord,
    _id: insertedId,
  };
}
