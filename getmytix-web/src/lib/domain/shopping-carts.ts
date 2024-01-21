import { z } from "zod";
import { getDB } from "../mongodb";

const shoppingCartSchema = z.object({
  sessionId: z.string(),
  subdomain: z.string(),
  tickets: z.record(z.number()),
});

export type ShoppingCart = z.infer<typeof shoppingCartSchema>;

export async function getShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<ShoppingCart | null> {
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

    const shoppingCart = shoppingCartSchema.parse(document);

    return shoppingCart;
  } catch (error) {
    console.error("Could not retrieve shopping cart", error);
    throw error;
  }
}

export async function createShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<ShoppingCart> {
  try {
    const shoppingCart = {
      sessionId: sessionId,
      subdomain: subdomain,
      tickets: {},
    };

    const db = await getDB();
    await db.collection("shoppingCarts").insertOne(shoppingCart);

    return shoppingCart;
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}

export async function updateShoppingCart(
  shoppingCart: ShoppingCart
): Promise<ShoppingCart> {
  try {
    const db = await getDB();
    const document = await db.collection("shoppingCarts").findOneAndUpdate(
      {
        sessionId: shoppingCart.sessionId,
        subdomain: shoppingCart.subdomain,
      },
      { $set: shoppingCart }
    );

    if (!document) {
      throw new Error("Shopping cart not found");
    }

    const updatedShoppingCart = shoppingCartSchema.parse(document);

    return updatedShoppingCart;
  } catch (error) {
    console.error("Could not update shopping cart", error);
    throw error;
  }
}
