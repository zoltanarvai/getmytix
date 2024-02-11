import * as R from "remeda";
import * as orders from "../orders";
import * as events from "../events";
import * as services from "./services";

export async function generateInvoice(
  order: orders.Order,
  event: events.Event
): Promise<void> {
  console.info("Generating invoice for order", order.id);

  const getTicketType = (ticketId: string) => {
    const ticketType = event.ticketTypes.find(
      (ticketType) => ticketType.id === ticketId
    );

    if (!ticketType) {
      throw new Error(`Ticket type ${ticketId} not found in event ${event.id}`);
    }

    return ticketType;
  };

  const invoiceItems = R.pipe(
    order.items,
    R.groupBy((ticket) => ticket.itemId),
    Object.entries,
    R.map(([key, group]) => {
      const ticketType = getTicketType(key);

      return {
        itemId: ticketType.id,
        itemType: ticketType.type,
        quantity: group.length,
        unitPrice: ticketType.price,
      };
    })
  );

  await services.generateInvoice({
    orderId: order.id,
    billingDetails: order.customerDetails,
    items: invoiceItems,
  });

  console.info("Generated invoice items", invoiceItems);
}
