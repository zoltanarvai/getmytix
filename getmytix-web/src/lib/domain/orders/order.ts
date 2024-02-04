import { Domain } from "@/lib/types";
import * as events from "../events";
import * as invoices from "../invoices";
import * as shoppingCarts from "../shopping-cart";
import * as tickets from "../tickets";
import * as repository from "./repository";

export type Order = Domain<repository.OrderRecord>;
export type CustomerOrderDetails = repository.OrderRecord["customerDetails"];

export function isPaid(order: Order): boolean {
  return order.history.some((event) => event.event === "paid");
}

export async function getOrder(orderId: string): Promise<Order> {
  const order = await repository.getOrder(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  return {
    id: order._id.toHexString(),
    ...order,
  };
}

export async function createOrder(
  shoppingCartId: string,
  customerDetails: CustomerOrderDetails
): Promise<string> {
  const shoppingCart = await shoppingCarts.getShoppingCart(shoppingCartId);

  const order: repository.CreateOrder = {
    customerDetails,
    eventId: shoppingCart.eventId,
    items: shoppingCart.items,
    shoppingCartId,
    history: [
      {
        timestamp: new Date().toUTCString(),
        event: "created",
      },
    ],
  };

  return await repository.createOrder(order);
}

export async function calculateTotalOrderValue(
  orderId: string
): Promise<number> {
  const order = await repository.getOrder(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const total = order.items.reduce((acc, ticket) => {
    return acc + ticket.unitPrice;
  }, 0);

  return total;
}

export async function fulfill(orderId: string): Promise<void> {
  console.info("fullfilling order", orderId);

  const historyItem: repository.HistoryItem = {
    timestamp: new Date().toISOString(),
    event: "paid",
  };

  await repository.addHistoryItem(orderId, historyItem);

  const order = await getOrder(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const event = await events.getEventById(order.eventId);
  if (!event) {
    throw new Error(`Event ${order.eventId} not found`);
  }

  await tickets.generateTickets(order, event);
  await invoices.generateInvoice(order, event);
  await shoppingCarts.deleteCart(order.shoppingCartId);
}
