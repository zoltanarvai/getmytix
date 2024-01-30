import { ShoppingCartItem } from "./schema";
import { getDB } from "../../../mongodb";
import { ObjectId } from "mongodb";

export async function addItemsToCart(
  shoppingCartId: string,
  items: ShoppingCartItem[]
): Promise<void> {
  try {
    const db = await getDB();
    const collection = await db.collection("shoppingCarts");

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(shoppingCartId) },
      { $push: { items: { $each: items } } }
    );

    if (updateResult.modifiedCount !== 1) {
      throw new Error("Could add items to cart.");
    }
  } catch (error) {
    console.error("Could not add items to cartt", error);
    throw error;
  }
}
