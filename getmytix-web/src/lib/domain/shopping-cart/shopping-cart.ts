import { get } from "http";
import {
  createShoppingCart,
  getShoppingCart,
  getShoppingCartById,
  updateShoppingCart,
  ShoppingCart as ShoppingCartRecord,
} from "./repository";
import { getEvent } from "../events";

export class ShoppingCart {
  static async initialize(
    sessionId: string,
    subdomain: string
  ): Promise<string> {
    const shoppingCart = await getShoppingCart(sessionId, subdomain);

    if (shoppingCart) {
      return shoppingCart._id.toHexString();
    }

    const shoppingCartId = await createShoppingCart(sessionId, subdomain);
    return shoppingCartId;
  }

  static async getTickets(
    shoppingCartId: string
  ): Promise<ShoppingCartRecord["tickets"]> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);

    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    return shoppingCart.tickets;
  }

  static async getTotalValue(shoppingCartId: string): Promise<number> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);
    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    const event = await getEvent(shoppingCart.subdomain);
    if (!event) {
      throw new Error("Event not found");
    }

    const tickets = event.ticketTypes;

    const total = Object.entries(shoppingCart.tickets).reduce(
      (acc, [ticketId, qty]) => {
        const ticket = tickets.find((ticket) => ticket.id === ticketId);
        if (!ticket) {
          throw new Error(`Ticket ${ticketId} not found`);
        }

        return acc + ticket.price * qty;
      },
      0
    );

    return total;
  }

  static async getShoppingCart(
    shoppingCartId: string
  ): Promise<ShoppingCartRecord> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);

    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    return shoppingCart;
  }

  static async addTicket(
    shoppingCartId: string,
    ticketId: string,
    quantity: number
  ): Promise<void> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);

    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    await updateShoppingCart(shoppingCartId, {
      ...shoppingCart.tickets,
      [ticketId]: quantity,
    });
  }
}
