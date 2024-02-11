import * as uuid from "uuid";
import { createHash } from "crypto";
import base32Encode from "base32-encode";
import { ObjectId } from "bson";
import { getDB } from "@/lib/mongodb";
import { CreateTicket, TicketRecord, createTicketSchema } from "./schema";

function generateHashedCodeWithSalt(
  ticketObjectId: string,
  eventCreationTimestamp: string
): string {
  const secretSalt: string = uuid.v4();

  // Extract the last 4 characters of the ObjectId
  const ticketIdComponent: string = ticketObjectId.slice(-4);

  // Calculate the time elapsed since the event creation in seconds
  const now: number = Math.floor(Date.now() / 1000);
  const eventCreationTime: number = Math.floor(
    new Date(eventCreationTimestamp).getTime() / 1000
  );
  const timeElapsedComponent: string = (now - eventCreationTime).toString();

  // Concatenate the components with the secret salt and hash the result
  const saltedCode: string =
    ticketIdComponent + timeElapsedComponent + secretSalt;
  const hash: Buffer = createHash("sha256").update(saltedCode).digest();

  // Encode the first few bytes of the hash into Base32 and convert to uppercase
  const encoded: string = base32Encode(hash.slice(0, 4), "Crockford", {
    padding: false,
  }).toUpperCase();

  return encoded;
}

export async function createTicket(
  ticket: CreateTicket,
  eventCreationTimestamp: string
): Promise<TicketRecord> {
  const ticketRecord = {
    ...createTicketSchema.parse(ticket),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  const db = await getDB();

  const { insertedId } = await db.collection("tickets").insertOne(ticketRecord);

  const hashCode = generateHashedCodeWithSalt(
    insertedId.toHexString(),
    eventCreationTimestamp
  );

  await db.collection("tickets").updateOne(
    { _id: insertedId },
    {
      $set: {
        ticketCode: hashCode,
      },
    }
  );

  return {
    _id: insertedId,
    ...ticketRecord,
    ticketCode: hashCode,
  };
}
