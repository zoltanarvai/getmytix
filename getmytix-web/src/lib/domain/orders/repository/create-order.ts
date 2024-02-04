import { getDB } from "../../../mongodb";
import { createOrderSchema, CreateOrder } from "./schema";

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
