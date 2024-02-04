import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TicketRecord, ticketSchema } from "./schema";

export async function getTicketById(
  ticketId: string
): Promise<TicketRecord | null> {
  const db = await getDB();
  const ticket = await db
    .collection("tickets")
    .findOne({ _id: new ObjectId(ticketId) });

  if (!ticket) {
    return null;
  }

  return ticketSchema.parse(ticket);
}

export async function getTicketsForEvent(
  eventId: string
): Promise<TicketRecord[]> {
  const db = await getDB();
  const tickets = await db
    .collection("tickets")
    .find({ eventId: eventId })
    .toArray();

  return tickets.map((ticket) => ticketSchema.parse(ticket));
}
