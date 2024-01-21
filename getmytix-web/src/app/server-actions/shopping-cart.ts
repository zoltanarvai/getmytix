"use server";

import { z } from "zod";
import { shoppingCarts } from "@/lib/domain";

const updateShoppingCartPropsSchema = z.object({
  sessionId: z.string(),
  eventId: z.string(),
  tickets: z.record(z.number()),
});

type UpdateShoppingCartProps = z.infer<typeof updateShoppingCartPropsSchema>;

export async function createShoppingCart(
  sessionId: string,
  eventId: string
): Promise<shoppingCarts.ShoppingCart> {
  const shoppingCart = await shoppingCarts.createShoppingCart(
    sessionId,
    eventId
  );

  return shoppingCart;
}

export async function addTicketToShoppingCart(
  updateShoppingCartProps: UpdateShoppingCartProps
): Promise<shoppingCarts.ShoppingCart> {
  const validatesShoppingCart = updateShoppingCartPropsSchema.parse(
    updateShoppingCartProps
  );

  const { tickets, sessionId, eventId } = validatesShoppingCart;

  if (tickets.length === 0) {
    throw new Error("No tickets to add");
  }

  const shoppingCart = await shoppingCarts.getShoppingCart(sessionId, eventId);

  if (!shoppingCart) {
    throw new Error("Shopping cart not found");
  }

  const updatedShoppingCart = {
    ...shoppingCart,
    tickets: {
      ...shoppingCart.tickets,
      ...tickets,
    },
  };

  shoppingCarts.updateShoppingCart(updatedShoppingCart);

  return updatedShoppingCart;
}
