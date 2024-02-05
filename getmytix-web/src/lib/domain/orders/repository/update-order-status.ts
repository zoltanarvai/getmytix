import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { OrderStatus } from "./schema";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const db = await getDB();

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status,
        updatedAt: new Date().toUTCString(),
      },
    }
  );
}
