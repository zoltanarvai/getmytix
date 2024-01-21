import { z } from "zod";
import { getDB } from "../mongodb";
import { ObjectId } from "mongodb";
import { Domain, Optional } from "../types";

const shoppingCartSchema = z.object({
  _id: z.instanceof(ObjectId),
  sessionId: z.string(),
  subdomain: z.string(),
  tickets: z.record(z.number()),
});

export type ShoppingCart = z.infer<typeof shoppingCartSchema>;

export async function getShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<Optional<Domain<ShoppingCart>>> {
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

    const { _id, ...rest } = shoppingCartSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (error) {
    console.error("Could not retrieve shopping cart", error);
    throw error;
  }
}

export async function createShoppingCart(
  sessionId: string,
  subdomain: string
): Promise<Domain<ShoppingCart>> {
  try {
    const shoppingCart = {
      sessionId: sessionId,
      subdomain: subdomain,
      tickets: {},
    };

    const db = await getDB();
    const document = await db
      .collection("shoppingCarts")
      .insertOne(shoppingCart);

    return {
      id: document.insertedId.toHexString(),
      ...shoppingCart,
    };
  } catch (error) {
    console.error("Could not create shopping cart", error);
    throw error;
  }
}

export async function updateShoppingCart(
  shoppingCart: ShoppingCart
): Promise<Domain<ShoppingCart>> {
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

    const { _id, ...rest } = shoppingCartSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (error) {
    console.error("Could not update shopping cart", error);
    throw error;
  }
}
