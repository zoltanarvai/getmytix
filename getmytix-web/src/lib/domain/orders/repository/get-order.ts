import {ObjectId} from "mongodb";
import {getDB} from "@/lib/mongodb";
import {Maybe} from "@/lib/types";
import {OrderRecord, orderSchema} from "./schema";

export async function getOrder(orderId: string): Promise<Maybe<OrderRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("orders").findOne({
            _id: new ObjectId(orderId),
        });

        if (!document) {
            console.error(`Could not find order for id: ${orderId}`);
            return null;
        }

        const orderRecord = orderSchema.parse(document);

        return orderRecord;
    } catch (e) {
        console.error("Could not get order", e);
        return null;
    }
}

export async function getOrderByUniqueId(uniqueId: string): Promise<Maybe<OrderRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("orders").findOne({
            orderUniqueId: uniqueId,
        });

        if (!document) {
            console.error(`Could not find order for uniqueId: ${uniqueId}`);
            return null;
        }

        const orderRecord = orderSchema.parse(document);

        return orderRecord;
    } catch (e) {
        console.error("Could not get order", e);
        return null;
    }
}


