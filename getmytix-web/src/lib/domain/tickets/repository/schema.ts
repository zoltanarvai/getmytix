import { z } from "zod";
import { ObjectId } from "mongodb";

export const ticketSchema = z.object({
  _id: z.instanceof(ObjectId),
  ticketTypeId: z.string(),
  eventId: z.string(),
  orderId: z.string(),
  status: z.union([
    z.literal("created"),
    z.literal("printed"),
    z.literal("sent"),
  ]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TicketRecord = z.infer<typeof ticketSchema>;
