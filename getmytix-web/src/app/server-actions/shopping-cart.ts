"use server";

import { z } from "zod";
import { shoppingCart } from "@/lib/domain";
import { revalidatePath } from "next/cache";

const updateShoppingCartPropsSchema = z.object({
  shoppingCartId: z.string(),
  items: z.object({
    itemId: z.string(),
    quantity: z.number(),
  }),
});

type UpdateShoppingCartProps = z.infer<typeof updateShoppingCartPropsSchema>;

export async function addItemToShoppingCart(
  updateShoppingCartProps: UpdateShoppingCartProps
): Promise<{
  result: "added" | "not-enough-tickets";
}> {
  const validatesShoppingCart = updateShoppingCartPropsSchema.parse(
    updateShoppingCartProps
  );

  const { items, shoppingCartId } = validatesShoppingCart;

  const result = await shoppingCart.addItems(
    shoppingCartId,
    items.itemId,
    items.quantity
  );

  revalidatePath("/tickets");

  return result;
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

  await shoppingCart.removeItem(shoppingCartId, itemId);

  revalidatePath("/tickets");
}
