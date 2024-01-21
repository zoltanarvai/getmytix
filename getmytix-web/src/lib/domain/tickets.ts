import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string(),
  type: z.string(),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
});

export type TicketType = z.infer<typeof ticketSchema>;
