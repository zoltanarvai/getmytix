import { getDB } from "../../../mongodb";

export async function createShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<string> {
  try {
    const shoppingCart = {
      sessionId: sessionId,
      subdomain: subdomain,
      items: [],
    };

    const db = await getDB();
    const document = await db
      .collection("shoppingCarts")
      .insertOne(shoppingCart);

    return document.insertedId.toHexString();
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}
