import { z } from "zod";
import { getDB } from "@/lib/mongodb";
import { ticketSchema } from "./tickets";
import { ObjectId } from "mongodb";

export const eventSchema = z.object({
  _id: z.instanceof(ObjectId),
  id: z.string(),
  name: z.string(),
  description: z.string(),
  longDescription: z.string(),
  logo: z.string(),
  banner: z.string(),
  subdomain: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string().optional(),
  location: z.string(),
  ticketTypes: z.array(ticketSchema),
});

export type Event = z.infer<typeof eventSchema>;

export async function getEvent(subdomain: string): Promise<Event | null> {
  try {
    const db = await getDB();
    //
    // Then you can execute queries against your database like so:
    const document = await db.collection("events").findOne({
      subdomain: subdomain,
    });

    if (!document) {
      console.error(`Could not find event for subdomain: ${subdomain}`);
      return null;
    }

    const event = eventSchema.parse({
      ...document,
      id: document._id.toHexString(),
    });

    console.log(event);

    return event;
  } catch (e) {
    console.error("Could not get event", e);
    return null;
  }
}
