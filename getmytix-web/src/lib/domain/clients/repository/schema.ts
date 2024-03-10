import {z} from "zod";
import {ObjectId} from "mongodb";

export const clientSchema = z.object({
    _id: z.instanceof(ObjectId),
    name: z.string(),
    slug: z.string(),
    invoicePrefix: z.string(),
    domain: z.string(),
    bank: z.string(),
    accountNumber: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ClientRecord = z.infer<typeof clientSchema>;