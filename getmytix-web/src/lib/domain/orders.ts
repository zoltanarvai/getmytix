import { z } from "zod";
import { getDB } from "../mongodb";

const createOrderSchema = z.object({
  sessionId: z.string(),
  user: z.object({
    email: z.string(),
    id: z.string(),
  }),
  subdomain: z.string(),
  customerDetails: z.object({
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  shoppingCart: z.object({
    tickets: z.record(z.number()),
  }),
  history: z
    .array(
      z.object({
        timestamp: z.string(),
        event: z.enum([
          "created",
          "paid",
          "cancelled",
          "refunded",
          "invoiced",
          "completed",
        ]),
      })
    )
    .optional()
    .default([]),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;

export async function createOrder(createOrder: CreateOrder): Promise<string> {
  try {
    const entry = createOrderSchema.parse(createOrder);
    const db = await getDB();
    const result = await db.collection("orders").insertOne(entry);

    return result.insertedId.toHexString();
  } catch (error) {
    console.error("Could not create order", error);
    throw error;
  }
}
