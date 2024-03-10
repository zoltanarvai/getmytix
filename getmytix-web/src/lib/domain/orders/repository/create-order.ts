import {getDB} from "../../../mongodb";
import {CreateOrder, createOrderSchema} from "./schema";

export async function createOrder(createOrder: CreateOrder): Promise<string> {
    try {
        const entry = createOrderSchema.parse(createOrder);

        const db = await getDB();
        const result = await db.collection("orders").insertOne({
            ...entry,
            createdAt: new Date().toUTCString(),
            updatedAt: new Date().toUTCString(),
        });

        return result.insertedId.toHexString();
    } catch (error) {
        console.error("Could not create order", error);
        throw error;
    }
}

export async function batchCreateOrders(createOders: CreateOrder[]): Promise<string[]> {
    try {
        const entries = createOders.map(order => createOrderSchema.parse(order));

        const db = await getDB();
        const result = await db.collection("orders").insertMany(entries.map(entry => ({
            ...entry,
            createdAt: new Date().toUTCString(),
            updatedAt: new Date().toUTCString(),
        })));

        return Object.values(result.insertedIds).map(id => id.toHexString())
    } catch (error) {
        console.error("Could not create orders", error);
        throw error;
    }
}
