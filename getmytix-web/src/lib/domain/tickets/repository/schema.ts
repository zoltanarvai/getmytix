import {z} from "zod";
import {ObjectId} from "mongodb";

export const ticketStatusSchema = z.union([
    z.literal("created"),
    z.literal("printed"),
]);

export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export const ticketSchema = z.object({
    _id: z.instanceof(ObjectId),
    ticketTypeId: z.string(),
    ticketUniqueId: z.string(),
    eventId: z.string(),
    orderId: z.string(),
    status: ticketStatusSchema,
    ticketUrl: z.string().optional(),
    ticketCode: z.string().optional(),
    details: z.object({
        guest: z.object({
            guestName: z.string().optional(),
            companyName: z.string().optional(),
            position: z.string().optional()
        }),
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

export const createTicketSchema = ticketSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateTicket = z.infer<typeof createTicketSchema>;
