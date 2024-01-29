import { ObjectId } from "mongodb";
import { getDB } from "../../../mongodb";
import { Optional } from "../../../types";
import { ShoppingCart, shoppingCartSchema } from "./schema";

export async function getShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<Optional<ShoppingCart>> {
  try {
    const db = await getDB();
    const document = await db.collection("shoppingCarts").findOne({
      sessionId: sessionId,
      subdomain: subdomain,
    });

    if (!document) {
      console.log("No shopping cart found");
      return null;
    }

    const shoppingCartRecord = shoppingCartSchema.parse(document);

    return shoppingCartRecord;
  } catch (error) {
    console.error("Could not retrieve shopping cart", error);
    throw error;
  }
}

export async function getShoppingCartById(
  shoppingCartId: string
): Promise<Optional<ShoppingCart>> {
  try {
    const db = await getDB();
    const document = await db
      .collection("shoppingCarts")
      .findOne({ _id: new ObjectId(shoppingCartId) });

    if (!document) {
      console.log("No shopping cart found");
      return null;
    }

    const shoppingCartRecord = shoppingCartSchema.parse(document);

    return shoppingCartRecord;
  } catch (error) {
    console.error("Could not retrieve shopping cart", error);
    throw error;
  }
}
