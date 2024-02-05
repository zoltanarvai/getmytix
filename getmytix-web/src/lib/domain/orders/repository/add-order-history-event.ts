import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { historyItemSchema, HistoryItem } from "./schema";

export async function addHistoryItem(
  orderId: string,
  historyItem: HistoryItem
): Promise<void> {
  try {
    const entry = historyItemSchema.parse(historyItem);
    const db = await getDB();
    const collection = await db.collection("orders");

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $push: { history: entry },
        $set: { updatedAt: new Date().toUTCString() },
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error("Could not add a history item.");
    }
  } catch (error) {
    console.error("Could not create order", error);
    throw error;
  }
}
