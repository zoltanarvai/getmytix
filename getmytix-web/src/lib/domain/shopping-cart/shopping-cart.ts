import {
  createShoppingCart,
  getShoppingCart,
  getShoppingCartById,
  addItemsToCart,
  ShoppingCart as ShoppingCartRecord,
  removeItemFromCart,
  clearShoppingCart,
  deleteShoppingCart,
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

  static async getShoppingCartItems(
    shoppingCartId: string
  ): Promise<ShoppingCartRecord["items"]> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);

    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    return shoppingCart.items || [];
  }

  static async getBasketValue(shoppingCartId: string): Promise<number> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);
    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    const total = shoppingCart.items.reduce((acc, item) => {
      return acc + item.unitPrice;
    }, 0);

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

  static async addItems(
    shoppingCartId: string,
    itemId: string,
    quantity: number
  ): Promise<void> {
    const shoppingCart = await getShoppingCartById(shoppingCartId);
    if (!shoppingCart) {
      throw new Error("Shopping cart not found");
    }

    const event = await getEvent(shoppingCart.subdomain);
    if (!event) {
      throw new Error("Event not found");
    }

    const ticketType = event.ticketTypes.find((ticket) => ticket.id === itemId);
    if (!ticketType) {
      throw new Error("Ticket type not found");
    }

    const items = [];
    for (let i = 0; i < quantity; i++) {
      items.push({
        itemId,
        unitPrice: ticketType.price,
      });
    }

    await addItemsToCart(shoppingCartId, items);
  }

  static async removeItem(
    shoppingCartId: string,
    itemId: string
  ): Promise<void> {
    await removeItemFromCart(shoppingCartId, itemId);
  }

  static async clear(shoppingCartId: string): Promise<void> {
    await clearShoppingCart(shoppingCartId);
  }

  static async deleteCart(shoppingCartId: string): Promise<void> {
    await deleteShoppingCart(shoppingCartId);
  }
}
