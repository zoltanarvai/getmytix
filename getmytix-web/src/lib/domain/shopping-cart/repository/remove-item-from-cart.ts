import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";

export async function removeItemFromCart(
  shoppingCartId: string,
  itemId: string
): Promise<void> {
  try {
    const db = await getDB();
    const collection = await db.collection("shoppingCarts");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(shoppingCartId) },
      { $pull: { items: { itemId: itemId } } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Could not remove item from cart.");
    }
  } catch (error) {
    console.error("Could not remove item from cart", error);
    throw error;
  }
}
