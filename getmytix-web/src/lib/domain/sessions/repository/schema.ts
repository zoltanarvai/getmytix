import {z} from "zod";
import {ObjectId} from "mongodb";

export const sessionSchema = z.object({
    _id: z.instanceof(ObjectId),
    customerId: z.string().optional().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type SessionRecord = z.infer<typeof sessionSchema>;
