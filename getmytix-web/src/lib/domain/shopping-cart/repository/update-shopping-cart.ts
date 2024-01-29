import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";

export async function updateShoppingCart(
  shoppingCartId: string,
  tickets: Record<string, number>
): Promise<void> {
  try {
    const db = await getDB();
    const collection = await db.collection("shoppingCarts");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(shoppingCartId) },
      { $set: { tickets: tickets } }
    );

    if (updateResult.modifiedCount !== 1) {
      throw new Error("Could not update the document.");
    }
  } catch (error) {
    console.error("Could not update shopping cart", error);
    throw error;
  }
}
