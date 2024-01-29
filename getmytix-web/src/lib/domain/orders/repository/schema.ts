import { ObjectId } from "mongodb";
import { z } from "zod";

export const historyItemSchema = z.object({
  timestamp: z.string(),
  event: z.enum([
    "created",
    "paid",
    "cancelled",
    "refunded",
    "invoiced",
    "completed",
  ]),
});

export const orderItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export const orderSchema = z.object({
  _id: z.instanceof(ObjectId),
  user: z.object({
    email: z.string(),
    id: z.string(),
  }),
  shoppingCartId: z.string(),
  eventId: z.string(),
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
  tickets: z.array(orderItemSchema),
  history: z.array(historyItemSchema).optional().default([]),
});

export type OrderRecord = z.infer<typeof orderSchema>;
