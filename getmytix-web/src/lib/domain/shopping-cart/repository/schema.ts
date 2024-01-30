import { z } from "zod";
import { ObjectId } from "mongodb";

export const shoppingCartItem = z.object({
  itemId: z.string(),
  unitPrice: z.number(),
});

export const shoppingCartSchema = z.object({
  _id: z.instanceof(ObjectId),
  sessionId: z.string(),
  subdomain: z.string(),
  items: z.array(shoppingCartItem),
});

export type ShoppingCart = z.infer<typeof shoppingCartSchema>;

export type ShoppingCartItem = z.infer<typeof shoppingCartItem>;
