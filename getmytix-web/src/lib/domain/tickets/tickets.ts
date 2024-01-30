import { Domain } from "@/lib/types";
import { Event } from "../events";
import { OrderRecord } from "../orders/repository";
import { generateTickets } from "./services";
import { createTicket, getTicketById, updateTicket } from "./repository";

export class Tickets {
  static async generateTickets(
    order: OrderRecord,
    event: Domain<Event>
  ): Promise<void> {
    const tickets = await Promise.all(
      order.tickets.map(async (orderedTicket) => {
        const ticketType = event.ticketTypes.find(
          (ticketType) => ticketType.id === orderedTicket.itemId
        );
        if (!ticketType) {
          throw new Error(
            `Ticket type ${orderedTicket.itemId} not found in event ${event.id}`
          );
        }

        const ticketId = await createTicket({
          orderId: order._id.toHexString(),
          eventId: event.id,
          ticketTypeId: orderedTicket.itemId,
          status: "created",
          details: {
            event,
            ticketType,
            customer: {
              name: order.customerDetails.name,
              email: order.user.email,
            },
          },
        });

        return {
          ticketId,
          ticketTypeId: orderedTicket.itemId,
          ticketType: ticketType.type,
          unitPrice: ticketType.price,
        };
      })
    );

    await generateTickets({
      orderId: order._id.toHexString(),
      tickets,
      eventDetails: {
        name: event.name,
        description: event.description,
        notes: event.notes,
        startDate: event.startDateTime,
        address: event.address,
        logo: event.logo,
      },
      customerDetails: {
        name: order.customerDetails.name,
        email: order.user.email,
      },
    });
  }

  static async setTicketStatus(
    ticketId: string,
    status: "printed" | "sent"
  ): Promise<void> {
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    await updateTicket(ticketId, status);
  }
}
