import { Domain } from "@/lib/types";
import type { Order } from "../orders";
import * as events from "../events";
import * as services from "./services";
import * as repository from "./repository";

export type Ticket = Domain<repository.TicketRecord>;

const HTTP_SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

export async function getTicketsForEvent(eventId: string): Promise<Ticket[]> {
  const tickets = await repository.getTicketsForEvent(eventId);

  return tickets.map((ticket) => {
    const { _id, ...rest } = ticket;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  });
}

export async function generateTickets(
  order: Order,
  event: events.Event
): Promise<void> {
  const tickets = await Promise.all(
    order.items.map(async (orderedTicket) => {
      const ticketType = event.ticketTypes.find(
        (ticketType) => ticketType.id === orderedTicket.itemId
      );

      if (!ticketType) {
        throw new Error(
          `Ticket type ${orderedTicket.itemId} not found in event ${event.id}`
        );
      }

      const ticket = await repository.createTicket({
        orderId: order.id,
        eventId: event.id,
        ticketTypeId: orderedTicket.itemId,
        status: "created",
        details: {
          event,
          ticketType,
          customer: {
            name: order.customerDetails.name,
            email: order.customerDetails.email,
          },
        },
      });

      return {
        ticketId: ticket._id.toHexString(),
        ticketTypeId: orderedTicket.itemId,
        ticketType: ticketType.type,
        unitPrice: ticketType.price,
        ticketCallbackUrl: `${HTTP_SCHEME}://api.${
          process.env.HOST
        }/tickets/${ticket._id.toHexString()}`,
      };
    })
  );

  await services.generateTickets({
    orderId: order.id,
    orderCallbackUrl: `${HTTP_SCHEME}://api.${process.env.HOST}/orders/${order.id}`,
    tickets,
    eventDetails: {
      id: event.id,
      name: event.name,
      subdomain: event.subdomain,
      description: event.description,
      notes: event.notes,
      startDate: event.startDateTime,
      endDate: event.endDateTime,
      address: event.address,
      logo: event.logo,
    },
    customerDetails: {
      name: order.customerDetails.name,
      email: order.customerDetails.email,
    },
  });
}

export async function setTicketStatus(
  ticketId: string,
  status: repository.TicketStatus,
  ticketUrl?: string
): Promise<void> {
  const ticket = await repository.getTicketById(ticketId);
  if (!ticket) {
    throw new Error(`Ticket ${ticketId} not found`);
  }

  await repository.updateTicket(ticketId, status, ticketUrl);
}
