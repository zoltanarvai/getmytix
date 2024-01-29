import { Domain } from "@/lib/types";
import { getEventById, Event } from "../events";
import { Invoices } from "../invoices";
import { ShoppingCart } from "../shopping-cart";
import { Tickets } from "../tickets/tickets";
import { User } from "../users";
import {
  OrderRecord,
  createOrder,
  addHistoryItem,
  AddHistoryItem,
  getOrder,
  CreateOrder,
} from "./repository";

export class Order {
  static isPaid(order: OrderRecord): boolean {
    return order.history.some((event) => event.event === "paid");
  }

  static async createOrder(
    shoppingCartId: string,
    customerDetails: CreateOrder["customerDetails"],
    user: Domain<User>,
    event: Domain<Event>
  ): Promise<string> {
    const shoppingCart = await ShoppingCart.getShoppingCart(shoppingCartId);
    const ticketsToOrder: CreateOrder["tickets"] = Object.keys(
      shoppingCart.tickets
    ).map((ticketId) => {
      const quantity = shoppingCart.tickets[ticketId];
      const unitPrice = event.ticketTypes.find(
        (ticketType) => ticketType.id === ticketId
      )?.price;

      if (!unitPrice) {
        throw new Error(`Ticket ${ticketId} not found`);
      }

      return {
        itemId: ticketId,
        quantity,
        unitPrice,
      };
    });

    const order: CreateOrder = {
      shoppingCartId,
      user,
      customerDetails,
      eventId: event.id,
      tickets: ticketsToOrder,
      history: [
        {
          timestamp: new Date().toUTCString(),
          event: "created",
        },
      ],
    };

    return await createOrder(order);
  }

  static async calculateTotal(orderId: string): Promise<number> {
    const order = await getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const total = order.tickets.reduce((acc, ticket) => {
      return acc + ticket.quantity * ticket.unitPrice;
    }, 0);

    return total;
  }

  static async fulfill(orderId: string): Promise<void> {
    console.info("fullfilling order", orderId);
    // STEP 1. Mark the order as paid
    const historyItem: AddHistoryItem = {
      timestamp: new Date().toISOString(),
      event: "paid",
    };

    await addHistoryItem(orderId, historyItem);

    const order = await getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const event = await getEventById(order.eventId);
    if (!event) {
      throw new Error(`Event ${order.eventId} not found`);
    }

    // STEP 2. Kick off ticket generation process
    await Tickets.generateTickets(order, event);

    // STEP 3. Kick off invoicing process
    await Invoices.generateInvoice(order, event);

    // TODO: Add API to update ticket status
    // printed, sent

    // TODO: Add API for order updates
    // invoiced (invoice sent), fulfilled (email sent)
  }
}
