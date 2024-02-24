import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import {HistoryItem, historyItemSchema} from "./schema";

export async function addHistoryItem(
    orderId: string,
    historyItem: HistoryItem
): Promise<void> {
    try {
        const entry = historyItemSchema.parse(historyItem);
        const db = await getDB();
        await db.collection("orders").updateOne(
            {_id: new ObjectId(orderId)},
            {
                $push: {history: entry},
                $set: {updatedAt: new Date().toUTCString()},
            }
        );
    } catch (error) {
        console.error("Could not create order", error);
        throw error;
    }
}
