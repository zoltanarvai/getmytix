import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";

export async function removeItemFromCart(
  shoppingCartId: string,
  itemId: string
): Promise<void> {
  try {
    const db = await getDB();
    const collection = await db.collection("shoppingCarts");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(shoppingCartId) },
      {
        $pull: { items: { itemId: itemId } },
        $set: { updatedAt: new Date().toUTCString() },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Could not remove item from cart.");
    }
  } catch (error) {
    console.error("Could not remove item from cart", error);
    throw error;
  }
}
