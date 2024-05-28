import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import {HistoryItem, historyItemSchema} from "./schema";

export async function addHistoryItem(
    orderId: string,
    historyItem: HistoryItem
): Promise<void> {
    try {
        const entry = historyItemSchema.parse(historyItem);
        console.info("addHistoryItem - getting db connection")

        const db = await getDB();

        console.info("addHistoryItem - db connection estabilished")

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
