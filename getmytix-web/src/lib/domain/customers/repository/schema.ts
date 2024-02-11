import { z } from "zod";
import { ObjectId } from "mongodb";

export const customerSchema = z.object({
  _id: z.instanceof(ObjectId),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CustomerRecord = z.infer<typeof customerSchema>;
