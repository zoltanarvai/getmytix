"use server";

import { z } from "zod";
import { shoppingCart } from "@/lib/domain";
import { revalidatePath } from "next/cache";

const updateShoppingCartPropsSchema = z.object({
  shoppingCartId: z.string(),
  tickets: z.object({
    ticketId: z.string(),
    quantity: z.number(),
  }),
});

type UpdateShoppingCartProps = z.infer<typeof updateShoppingCartPropsSchema>;

export async function addTicketToShoppingCart(
  updateShoppingCartProps: UpdateShoppingCartProps
): Promise<void> {
  const validatesShoppingCart = updateShoppingCartPropsSchema.parse(
    updateShoppingCartProps
  );

  const { tickets, shoppingCartId } = validatesShoppingCart;

  await shoppingCart.ShoppingCart.addTicket(
    shoppingCartId,
    tickets.ticketId,
    tickets.quantity
  );

  revalidatePath("/checkout");
}
