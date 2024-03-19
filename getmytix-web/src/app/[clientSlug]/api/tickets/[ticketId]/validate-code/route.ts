import {events, tickets} from "@/lib/domain";

type TicketDetails = {
    ticketId: string;
    ticketCode: string;
    name: string;
    position: string;
    company: string;
    ticketType: string;
    eventName: string;
}

export async function GET(request: Request) {

    // get ticket id from URL
    const url = new URL(request.url);
    const fragments = url.pathname.split("/");
    const ticketCode = fragments[fragments.length - 2];

    // Retrieve Ticket
    try {
        const ticket = await tickets.getTicketByCode(ticketCode);
        const event = await events.getEventById(ticket.eventId);
        if (!event) {
            throw new Error("No such event");
        }

        const ticketDetails: TicketDetails = {
            ticketId: ticket.id,
            ticketCode: ticket.ticketCode!,
            name: ticket.details.guest.guestName || "",
            position: ticket.details.guest.position || "",
            company: ticket.details.guest.companyName || "",
            ticketType: ticket.details.ticketType.type,
            eventName: event!.name,
        }

        return Response.json(ticketDetails);
    } catch {
        return Response.json({error: "No such ticket"}, {status: 404});
    }
}
