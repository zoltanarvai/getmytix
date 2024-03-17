import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import {TicketRecord, ticketSchema} from "./schema";

export async function getTicketById(
    ticketId: string
): Promise<TicketRecord | null> {
    const db = await getDB();
    const ticket = await db
        .collection("tickets")
        .findOne({_id: new ObjectId(ticketId)});

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
        .find({eventId: eventId})
        .toArray();

    return tickets.map((ticket) => ticketSchema.parse(ticket));
}

export async function getTicketsForOrder(
    orderId: string
): Promise<TicketRecord[]> {
    const db = await getDB();
    const tickets = await db
        .collection("tickets")
        .find({orderId: orderId})
        .toArray();

    return tickets.map((ticket) => ticketSchema.parse(ticket));
}

export async function getTicketByUniqueId(
    ticketUniqueId: string
): Promise<TicketRecord> {
    const db = await getDB();
    const ticket = await db
        .collection("tickets")
        .findOne({ticketUniqueId: ticketUniqueId});

    return ticketSchema.parse(ticket);
}

export async function getTicketByCode(
    ticketCode: string
): Promise<TicketRecord> {
    const db = await getDB();
    const ticket = await db
        .collection("tickets")
        .findOne({ticketCode: ticketCode});

    return ticketSchema.parse(ticket);
}



