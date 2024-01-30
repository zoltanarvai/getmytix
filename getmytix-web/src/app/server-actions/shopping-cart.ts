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

export async function addItemToShoppingCart(
  updateShoppingCartProps: UpdateShoppingCartProps
): Promise<void> {
  const validatesShoppingCart = updateShoppingCartPropsSchema.parse(
    updateShoppingCartProps
  );

  const { tickets, shoppingCartId } = validatesShoppingCart;

  await shoppingCart.ShoppingCart.addItems(
    shoppingCartId,
    tickets.ticketId,
    tickets.quantity
  );

  revalidatePath("/checkout");
}

const removeShoppingCartItemSchema = z.object({
  shoppingCartId: z.string(),
  itemId: z.string(),
});

type RemoveShoppingCartItemProps = z.infer<typeof removeShoppingCartItemSchema>;

export async function removeItemFromShoppingCart(
  removeShoppingCartItemProps: RemoveShoppingCartItemProps
): Promise<void> {
  const validatedRequest = removeShoppingCartItemSchema.parse(
    removeShoppingCartItemProps
  );

  const { itemId, shoppingCartId } = validatedRequest;

  await shoppingCart.ShoppingCart.removeItem(shoppingCartId, itemId);

  revalidatePath("/checkout");
}
