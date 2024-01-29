import { z } from "zod";
import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";
import { historyItemSchema } from "./schema";

export type AddHistoryItem = z.infer<typeof historyItemSchema>;

export async function addHistoryItem(
  orderId: string,
  historyItem: AddHistoryItem
): Promise<void> {
  try {
    const entry = historyItemSchema.parse(historyItem);
    const db = await getDB();
    const collection = await db.collection("orders");

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $push: { history: entry } }
    );

    if (result.modifiedCount !== 1) {
      throw new Error("Could not add a history item.");
    }
  } catch (error) {
    console.error("Could not create order", error);
    throw error;
  }
}
