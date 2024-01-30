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
    const ticketsToOrder: CreateOrder["tickets"] = shoppingCart.items;

    const order: CreateOrder = {
      user,
      customerDetails,
      eventId: event.id,
      tickets: ticketsToOrder,
      shoppingCartId,
      history: [
        {
          timestamp: new Date().toUTCString(),
          event: "created",
        },
      ],
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    return await createOrder(order);
  }

  static async calculateTotal(orderId: string): Promise<number> {
    const order = await getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const total = order.tickets.reduce((acc, ticket) => {
      return acc + ticket.unitPrice;
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

    await Tickets.generateTickets(order, event);
    await Invoices.generateInvoice(order, event);
    await ShoppingCart.deleteCart(order.shoppingCartId);

    // TODO: Add API to update ticket status
    // printed, sent

    // TODO: Add API for order updates
    // invoiced (invoice sent), fulfilled (email sent)
  }
}
