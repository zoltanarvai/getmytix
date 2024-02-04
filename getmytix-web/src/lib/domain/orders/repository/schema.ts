import { z } from "zod";
import { ObjectId } from "mongodb";

export const historyItemSchema = z.object({
  timestamp: z.string(),
  event: z.enum([
    "created",
    "paid",
    "cancelled",
    "refunded",
    "invoiced",
    "delivered",
  ]),
});

export type HistoryItem = z.infer<typeof historyItemSchema>;

export const orderItemSchema = z.object({
  itemId: z.string(),
  unitPrice: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  _id: z.instanceof(ObjectId),
  shoppingCartId: z.string(),
  eventId: z.string(),
  customerDetails: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  items: z.array(orderItemSchema),
  history: z.array(historyItemSchema).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type OrderRecord = z.infer<typeof orderSchema>;

export const createOrderSchema = orderSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateOrder = z.infer<typeof createOrderSchema>;
