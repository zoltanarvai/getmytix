import { getDB } from "@/lib/mongodb";
import { ShoppingCartRecord } from ".";

export async function createShoppingCart(
  sessionId: string,
  subdomain: string,
  eventId: string
): Promise<ShoppingCartRecord> {
  try {
    const shoppingCart = {
      sessionId: sessionId,
      subdomain: subdomain,
      eventId: eventId,
      items: [],
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    const db = await getDB();
    const document = await db
      .collection("shoppingCarts")
      .insertOne(shoppingCart);

    return {
      _id: document.insertedId,
      ...shoppingCart,
    };
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}
