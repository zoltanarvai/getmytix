import * as uuid from "uuid";
import {Domain} from "@/lib/types";
import type {Order} from "../orders";
import * as clients from "../clients";
import * as events from "../events";
import * as services from "./services";
import * as repository from "./repository";

export type Ticket = Domain<repository.TicketRecord>;

const HTTP_SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

export async function getTicketsForEvent(eventId: string): Promise<Ticket[]> {
    console.info("Getting tickets for event", eventId);

    const tickets = await repository.getTicketsForEvent(eventId);

    return tickets.map((ticket) => {
        const {_id, ...rest} = ticket;

        return {
            id: _id.toHexString(),
            ...rest,
        };
    });
}

export async function getTicketsByOrderId(orderId: string): Promise<Ticket[]> {
    console.info("Getting tickets for order", orderId);

    const tickets = await repository.getTicketsForOrder(orderId);

    return tickets.map((ticket) => {
        const {_id, ...rest} = ticket;

        return {
            id: _id.toHexString(),
            ...rest,
        };
    });
}

export async function getTicketByTicketUniqueId(ticketUniqueId: string): Promise<Ticket> {
    console.info("Getting ticket by uniqueId", ticketUniqueId);

    const ticket = await repository.getTicketByUniqueId(ticketUniqueId);

    const {_id, ...rest} = ticket;

    return {
        id: _id.toHexString(),
        ...rest,
    };
}

export async function generateTickets(
    order: Order,
    event: events.Event,
    client: clients.Client,
): Promise<void> {
    console.info("Generating tickets for order", order.id);
    const clientDomain = client.domain;

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

            const ticket = await repository.createTicket(
                {
                    orderId: order.id,
                    eventId: event.id,
                    clientId: client.id,
                    ticketTypeId: orderedTicket.itemId,
                    ticketUniqueId: uuid.v4(),
                    status: "created",
                    details: {
                        guest: {
                            guestName: orderedTicket.guestName,
                            companyName: orderedTicket.companyName,
                            position: orderedTicket.position
                        },
                        event,
                        ticketType,
                        customer: {
                            name: order.customerDetails.name,
                            email: order.customerDetails.email,
                        },
                    },
                },
                event.createdAt
            );

            return {
                ticketId: ticket._id.toHexString(),
                ticketTypeId: orderedTicket.itemId,
                ticketUniqueId: ticket.ticketUniqueId,
                guestName: ticket.details.guest.guestName,
                companyName: ticket.details.guest.companyName,
                position: ticket.details.guest.position,
                ticketType: ticketType.type,
                unitPrice: ticketType.price,
                ticketCode: ticket.ticketCode!,
                ticketCallbackUrl: `${HTTP_SCHEME}://${
                    clientDomain
                }/api/tickets/${ticket._id.toHexString()}`,
            };
        })
    );

    await services.generateTickets({
        orderId: order.id,
        orderUniqueId: order.orderUniqueId,
        orderCallbackUrl: `${HTTP_SCHEME}://${clientDomain}/api/orders/${order.id}`,
        orderDownloadUrl: `${HTTP_SCHEME}://${clientDomain}/download/${order.orderUniqueId}`,
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

    console.info("Generated tickets", tickets);
}

export async function setTicketStatus(
    ticketId: string,
    status: repository.TicketStatus,
    ticketUrl?: string
): Promise<void> {
    console.info(
        `Setting ticket status ${status} for ticket ${ticketId} with url ${ticketUrl}`
    );

    const ticket = await repository.getTicketById(ticketId);
    if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
    }

    await repository.updateTicket(ticketId, status, ticketUrl);

    console.info(`Ticket status set to ${status}`);
}