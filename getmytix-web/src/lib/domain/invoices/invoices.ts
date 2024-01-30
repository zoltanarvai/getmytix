import * as R from "remeda";
import { Domain } from "../../types";
import { OrderRecord } from "../orders/repository";
import { Event } from "../events";
import { generateInvoice } from "./services";

export class Invoices {
  static async generateInvoice(
    order: OrderRecord,
    event: Domain<Event>
  ): Promise<void> {
    const getTicketType = (ticketId: string) => {
      const ticketType = event.ticketTypes.find(
        (ticketType) => ticketType.id === ticketId
      );

      if (!ticketType) {
        throw new Error(
          `Ticket type ${ticketId} not found in event ${event.id}`
        );
      }

      return ticketType;
    };

    const tickets = R.pipe(
      order.tickets,
      R.groupBy((ticket) => ticket.itemId),
      Object.entries,
      R.map(([key, group]) => {
        const ticketType = getTicketType(key);

        return {
          ticketTypeId: ticketType.id,
          quantity: group.length,
          unitPrice: ticketType.price,
          ticketType: ticketType.type,
        };
      })
    );

    await generateInvoice({
      orderId: order._id.toHexString(),
      customerDetails: order.customerDetails,
      tickets,
    });
  }
}
