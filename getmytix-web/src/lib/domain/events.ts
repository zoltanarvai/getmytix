import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { Domain, Optional } from "../types";

export const ticketSchema = z.object({
  id: z.string(),
  type: z.string(),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
});

export type TicketType = z.infer<typeof ticketSchema>;

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
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  ticketTypes: z.array(ticketSchema),
});

export type Event = z.infer<typeof eventSchema>;

export async function getEvent(
  subdomain: string
): Promise<Optional<Domain<Event>>> {
  try {
    const db = await getDB();
    const document = await db.collection("events").findOne({
      subdomain: subdomain,
    });

    if (!document) {
      console.error(`Could not find event for subdomain: ${subdomain}`);
      return null;
    }

    const { _id, ...rest } = eventSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (e) {
    console.error("Could not get event", e);
    return null;
  }
}

export async function getEventById(
  eventId: string
): Promise<Optional<Domain<Event>>> {
  try {
    const db = await getDB();
    const document = await db.collection("events").findOne({
      _id: new ObjectId(eventId),
    });

    if (!document) {
      console.error(`Could not find event: ${eventId}`);
      return null;
    }

    const { _id, ...rest } = eventSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (e) {
    console.error("Could not get event", e);
    return null;
  }
}
