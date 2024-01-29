import { Domain } from "../../types";
import { OrderRecord } from "../orders/repository";
import { Event } from "../events";
import { generateInvoice } from "./services";

export class Invoices {
  static async generateInvoice(
    order: OrderRecord,
    event: Domain<Event>
  ): Promise<void> {
    const tickets = Object.keys(order.tickets).map((orderedTicketId) => {
      const ticketType = event.ticketTypes.find(
        (ticketType) => ticketType.id === orderedTicketId
      );
      if (!ticketType) {
        throw new Error(
          `Ticket type ${orderedTicketId} not found in event ${event.id}`
        );
      }

      return {
        ticketTypeId: orderedTicketId,
        ticketType: ticketType.type,
        quantity: order.tickets[orderedTicketId],
        unitPrice: ticketType.price,
      };
    });

    await generateInvoice({
      orderId: order._id.toHexString(),
      customerDetails: order.customerDetails,
      tickets,
    });
  }
}
