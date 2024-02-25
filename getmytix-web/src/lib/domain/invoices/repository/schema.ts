import {ObjectId} from "mongodb";
import {z} from "zod";

export const invoiceSchema = z.object({
    _id: z.instanceof(ObjectId),
    invoiceUniqueId: z.string(),
    orderId: z.string(),
    invoiceDate: z.string(),
    invoicePrefix: z.string(),
    seller: z.object({
        bank: z.string(),
        accountNumber: z.string(),
    }),
    billingDetails: z.object({
        name: z.string(),
        taxNumber: z.string().optional(),
        address: z.string(),
        email: z.string(),
        city: z.string(),
        zip: z.string(),
    }),
    items: z.array(
        z.object({
            itemId: z.string(),
            itemType: z.string(),
            quantity: z.number(),
            unitPrice: z.number(),
        })
    ),
    invoiceCallbackUrl: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type InvoiceRecord = z.infer<typeof invoiceSchema>;

export const createInvoiceSchema = invoiceSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
