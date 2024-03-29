import {z} from "zod";
import {ObjectId} from "mongodb";

export const orderStatusSchema = z.union([
    z.literal("created"),
    z.literal("paid"),
    z.literal("cancelled"),
    z.literal("refunded"),
    z.literal("invoiced"),
    z.literal("delivered"),
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const historyItemSchema = z.object({
    timestamp: z.string(),
    event: orderStatusSchema,
    metadata: z.record(z.any()).optional().nullable(),
});

export type HistoryItem = z.infer<typeof historyItemSchema>;

export const orderItemSchema = z.object({
    itemId: z.string(),
    unitPrice: z.number(),
    guestName: z.string().optional(),
    companyName: z.string().optional(),
    position: z.string().optional()
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const customerDetailsSchema = z.object({
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
    taxNumber: z.string().optional(),
})

export type CustomerDetailsRecord = z.infer<typeof customerDetailsSchema>;

export const orderSchema = z.object({
    _id: z.instanceof(ObjectId),
    orderUniqueId: z.string(),
    shoppingCartId: z.string(),
    eventId: z.string(),
    clientId: z.string(),
    customerDetails: customerDetailsSchema,
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
