import { z } from "zod";
import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";
import { Optional } from "../../../types";
import { OrderRecord, orderSchema } from "./schema";

export async function getOrder(
  orderId: string
): Promise<Optional<OrderRecord>> {
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
