import { ObjectId } from "mongodb";
import { getDB } from "../../../mongodb";

export async function deleteShoppingCart(
  shoppingCartId: string
): Promise<void> {
  try {
    const db = await getDB();
    const document = await db
      .collection("shoppingCarts")
      .deleteOne({ _id: new ObjectId(shoppingCartId) });

    if (!document.acknowledged) {
      throw new Error("Could not delete shopping cart.");
    }
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}
