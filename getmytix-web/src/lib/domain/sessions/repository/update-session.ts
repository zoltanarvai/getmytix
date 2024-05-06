import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function updateSessionWithCustomer(sessionId: string, customerId: string): Promise<void> {
    try {
        const db = await getDB();

        await db.collection("sessions").updateOne(
            {_id: new ObjectId(sessionId)},
            {
                $set: {
                    customerId,
                    updatedAt: new Date().toUTCString(),
                },
            }
        );
    } catch (error) {
        console.error("Could not update session", error);
        throw error;
    }
}
