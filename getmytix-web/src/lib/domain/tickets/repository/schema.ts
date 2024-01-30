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
  details: z.object({
    event: z.object({
      name: z.string(),
      description: z.string(),
      logo: z.string(),
      startDateTime: z.string(),
      notes: z.string(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        zipCode: z.string(),
      }),
    }),
    ticketType: z.object({
      type: z.string(),
      description: z.string(),
      price: z.number(),
    }),
    customer: z.object({
      name: z.string(),
      email: z.string(),
    }),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TicketRecord = z.infer<typeof ticketSchema>;
