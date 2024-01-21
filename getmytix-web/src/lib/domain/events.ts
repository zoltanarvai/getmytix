import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { ticketSchema } from "./tickets";
import { Domain, Optional } from "../types";

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
  location: z.string(),
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
