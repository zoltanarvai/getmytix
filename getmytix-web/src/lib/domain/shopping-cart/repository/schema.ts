import { z } from "zod";
import { ObjectId } from "mongodb";

export const shoppingCartSchema = z.object({
  _id: z.instanceof(ObjectId),
  sessionId: z.string(),
  subdomain: z.string(),
  tickets: z.record(z.number()),
});

export type ShoppingCart = z.infer<typeof shoppingCartSchema>;
