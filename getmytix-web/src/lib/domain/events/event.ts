import { Domain, Maybe } from "@/lib/types";
import { tickets } from "@/lib/domain";
import * as repository from "./repository";

export type Event = Domain<repository.EventRecord>;

export async function getEventById(eventId: string): Promise<Maybe<Event>> {
  console.info("Getting event by id", eventId);

  const event = await repository.getEventById(eventId);

  if (!event) {
    console.info("No such event found", eventId);
    return null;
  }

  const { _id, ...rest } = event;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function getEventBySubdomain(
  subdomain: string
): Promise<Maybe<Event>> {
  console.info("Getting event by subdomain", subdomain);

  const event = await repository.getEventBySubdomain(subdomain);

  if (!event) {
    console.info("No such event found", subdomain);
    return null;
  }

  const { _id, ...rest } = event;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function getAvailableQuantityPerTicketType(
  eventId: string
): Promise<Record<string, number>> {
  console.info("Getting available quantity per ticket type", eventId);

  const event = await repository.getEventById(eventId);
  if (!event) {
    throw new Error(`Event not found for id: ${eventId}`);
  }

  // Available quantity = total quantity - sold quantity
  const ticketTypes = event.ticketTypes;
  const soldTickets = await tickets.getTicketsForEvent(eventId);

  const soldQuantityPerTicketType = soldTickets.reduce((acc, ticket) => {
    if (!acc[ticket.ticketTypeId]) {
      acc[ticket.ticketTypeId] = 0;
    }

    acc[ticket.ticketTypeId] += 1;

    return acc;
  }, {} as Record<string, number>);

  const availableQuantityPerTicketType = ticketTypes.reduce(
    (acc, ticketType) => {
      const soldQuantity = soldQuantityPerTicketType[ticketType.id] || 0;

      acc[ticketType.id] = ticketType.quantity - soldQuantity;

      return acc;
    },
    {} as Record<string, number>
  );

  return availableQuantityPerTicketType;
}
