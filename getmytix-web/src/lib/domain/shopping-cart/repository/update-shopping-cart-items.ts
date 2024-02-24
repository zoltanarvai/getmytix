import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { ShoppingCartItem } from "./schema";

export async function updateCartItems(shoppingCartId: string, items: ShoppingCartItem[]): Promise<void> {
    try {
        const db = await getDB();
        const collection = db.collection("shoppingCarts");

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(shoppingCartId) },
            {
                $set: {
                    items: items,
                    updatedAt: new Date().toUTCString()
                },
            }
        );

        if (updateResult.modifiedCount !== 1) {
            throw new Error("Could not update items in cart.");
        }
    } catch (error) {
        console.error("Could not update items in cart", error);
        throw error;
    }
}
