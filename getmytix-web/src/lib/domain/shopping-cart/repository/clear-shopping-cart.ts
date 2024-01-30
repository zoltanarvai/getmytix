import { ShoppingCartItem } from "./schema";
import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";

export async function clearShoppingCart(shoppingCartId: string): Promise<void> {
  try {
    const db = await getDB();
    const collection = await db.collection("shoppingCarts");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(shoppingCartId) },
      { $set: { items: [] } }
    );

    if (updateResult.modifiedCount !== 1) {
      throw new Error("Could clear cart.");
    }
  } catch (error) {
    console.error("Could clear cart", error);
    throw error;
  }
}