import {z} from "zod";
import {ObjectId} from "mongodb";

export const shoppingCartItem = z.object({
    itemId: z.string(),
    unitPrice: z.number(),
    guestName: z.string().optional(),
    companyName: z.string().optional(),
    position: z.string().optional()
});

export type ShoppingCartItem = z.infer<typeof shoppingCartItem>;

export const shoppingCartSchema = z.object({
    _id: z.instanceof(ObjectId),
    sessionId: z.string(),
    subdomain: z.string(),
    eventId: z.string(),
    items: z.array(shoppingCartItem),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ShoppingCartRecord = z.infer<typeof shoppingCartSchema>;
