"use server";

import { z } from "zod";
import { shoppingCarts } from "@/lib/domain";

const updateShoppingCartPropsSchema = z.object({
  sessionId: z.string(),
  subdomain: z.string(),
  tickets: z.record(z.number()),
});

type UpdateShoppingCartProps = z.infer<typeof updateShoppingCartPropsSchema>;

export async function createShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<shoppingCarts.ShoppingCart> {
  const shoppingCart = await shoppingCarts.createShoppingCart(
    sessionId,
    subdomain
  );

  return shoppingCart;
}

export async function addTicketToShoppingCart(
  updateShoppingCartProps: UpdateShoppingCartProps
): Promise<shoppingCarts.ShoppingCart> {
  const validatesShoppingCart = updateShoppingCartPropsSchema.parse(
    updateShoppingCartProps
  );

  const { tickets, sessionId, subdomain } = validatesShoppingCart;

  if (tickets.length === 0) {
    throw new Error("No tickets to add");
  }

  const shoppingCart = await shoppingCarts.getShoppingCart(
    sessionId,
    subdomain
  );

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
