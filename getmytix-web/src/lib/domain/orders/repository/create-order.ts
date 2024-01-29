import { z } from "zod";
import { getDB } from "../../../mongodb";
import { orderSchema } from "./schema";

const createOrderSchema = orderSchema.omit({ _id: true });
export type CreateOrder = z.infer<typeof createOrderSchema>;

export async function createOrder(createOrder: CreateOrder): Promise<string> {
  try {
    const entry = createOrderSchema.parse(createOrder);
    const db = await getDB();
    const result = await db.collection("orders").insertOne(entry);

    return result.insertedId.toHexString();
  } catch (error) {
    console.error("Could not create order", error);
    throw error;
  }
}
