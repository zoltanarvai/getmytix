import { Domain } from "@/lib/types";
import * as repository from "./repository";
import * as events from "../events";

export type ShoppingCartItem = repository.ShoppingCartItem;
export type ShoppingCart = Domain<repository.ShoppingCartRecord>;

export async function initialize(
  sessionId: string,
  subdomain: string
): Promise<ShoppingCart> {
  console.info("Initializing shopping cart", sessionId, subdomain);

  let shoppingCart = await repository.getShoppingCart(sessionId, subdomain);

  if (!shoppingCart) {
    console.info("Shopping cart not found, creating new one");

    const event = await events.getEventBySubdomain(subdomain);
    if (!event) {
      throw new Error("Event not found");
    }

    shoppingCart = await repository.createShoppingCart(
      sessionId,
      subdomain,
      event.id
    );
  }

  const { _id, ...rest } = shoppingCart;

  console.info("Shopping cart initialized", _id.toHexString());

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function getShoppingCart(
  shoppingCartId: string
): Promise<ShoppingCart> {
  console.info("Getting shopping cart", shoppingCartId);

  const shoppingCart = await repository.getShoppingCartById(shoppingCartId);

  if (!shoppingCart) {
    throw new Error("Shopping cart not found");
  }

  const { _id, ...rest } = shoppingCart;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function addItems(
  shoppingCartId: string,
  itemId: string,
  quantity: number
): Promise<{
  result: "added" | "not-enough-tickets";
}> {
  console.info(
    "Adding items to shopping cart",
    shoppingCartId,
    itemId,
    quantity
  );

  const shoppingCart = await repository.getShoppingCartById(shoppingCartId);
  if (!shoppingCart) {
    throw new Error("Shopping cart not found");
  }

  const event = await events.getEventById(shoppingCart.eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const ticketType = event.ticketTypes.find((ticket) => ticket.id === itemId);
  if (!ticketType) {
    throw new Error("Ticket type not found");
  }

  const availableTicketsPerType =
    await events.getAvailableQuantityPerTicketType(event.id);

  const availableCountForType = availableTicketsPerType[itemId];
  const ticketsInCartForType = shoppingCart.items.filter(
    (item) => item.itemId === itemId
  ).length;

  if (availableCountForType < quantity + ticketsInCartForType) {
    console.warn("Not enough tickets available");
    return {
      result: "not-enough-tickets",
    };
  }

  const items = [];
  for (let i = 0; i < quantity; i++) {
    items.push({
      itemId,
      unitPrice: ticketType.price,
    });
  }

  await repository.addItemsToCart(shoppingCartId, items);

  console.info(
    `Items added to shopping cart ${shoppingCartId} for item ${itemId} with quantity ${quantity}`
  );

  return {
    result: "added",
  };
}

export async function removeItem(
  shoppingCartId: string,
  itemId: string
): Promise<void> {
  console.info("Removing item from shopping cart", shoppingCartId, itemId);

  await repository.removeItemFromCart(shoppingCartId, itemId);

  console.info(`Item removed from shopping cart ${shoppingCartId}`);
}

export async function clear(shoppingCartId: string): Promise<void> {
  console.info("Clearing shopping cart", shoppingCartId);

  await repository.clearShoppingCart(shoppingCartId);

  console.info("Shopping cart cleared", shoppingCartId);
}

export async function deleteCart(shoppingCartId: string): Promise<void> {
  console.info("Deleting shopping cart", shoppingCartId);

  await repository.deleteShoppingCart(shoppingCartId);

  console.info("Shopping cart deleted", shoppingCartId);
}

export async function getShoppingCartItems(
  shoppingCartId: string
): Promise<ShoppingCartItem[]> {
  console.info("Getting shopping cart items", shoppingCartId);

  const shoppingCart = await repository.getShoppingCartById(shoppingCartId);

  if (!shoppingCart) {
    throw new Error("Shopping cart not found");
  }

  return shoppingCart.items || [];
}

export async function calculateBasketValue(
  shoppingCartId: string
): Promise<number> {
  console.info("Calculating basket value", shoppingCartId);

  const shoppingCart = await repository.getShoppingCartById(shoppingCartId);
  if (!shoppingCart) {
    throw new Error("Shopping cart not found");
  }

  const total = shoppingCart.items.reduce((acc, item) => {
    return acc + item.unitPrice;
  }, 0);

  return total;
}
