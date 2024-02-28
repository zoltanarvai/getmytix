import {z} from "zod";
import {ObjectId} from "mongodb";
import {getDB} from "@/lib/mongodb";
import {Maybe} from "../../../types";

export const ticketTypeSchema = z.object({
    id: z.string(),
    type: z.string(),
    price: z.number(),
    quantity: z.number(),
    description: z.string(),
});

export type TicketType = z.infer<typeof ticketTypeSchema>;

export const clientInfoSchema = z.object({
    id: z.string(),
    slug: z.string()
});

export type ClientInfo = z.infer<typeof clientInfoSchema>;

export const eventSchema = z.object({
    _id: z.instanceof(ObjectId),
    name: z.string(),
    description: z.string(),
    longDescription: z.string(),
    logo: z.string(),
    banner: z.string(),
    subdomain: z.string(),
    startDateTime: z.string(),
    endDateTime: z.string().optional(),
    notes: z.string(),
    address: z.object({
        street: z.string(),
        city: z.string(),
        zipCode: z.string(),
    }),
    ticketTypes: z.array(ticketTypeSchema),
    clientInfo: clientInfoSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type EventRecord = z.infer<typeof eventSchema>;

export async function getEventBySubdomain(
    subdomain: string
): Promise<Maybe<EventRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("events").findOne({
            subdomain: subdomain,
        });

        if (!document) {
            console.error(`Could not find event for subdomain: ${subdomain}`);
            return null;
        }

        return eventSchema.parse(document);
    } catch (e) {
        console.error("Could not get event", e);
        return null;
    }
}

export async function getEventById(
    eventId: string
): Promise<Maybe<EventRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("events").findOne({
            _id: new ObjectId(eventId),
        });

        if (!document) {
            console.error(`Could not find event: ${eventId}`);
            return null;
        }

        return eventSchema.parse(document);
    } catch (e) {
        console.error("Could not get event", e);
        return null;
    }
}
