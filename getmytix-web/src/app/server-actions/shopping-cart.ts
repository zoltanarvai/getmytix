"use server";

import {z} from "zod";
import {shoppingCart} from "@/lib/domain";
import {revalidatePath} from "next/cache";

const addItemsToShoppingCartCartPropsSchema = z.object({
    shoppingCartId: z.string(),
    items: z.object({
        itemId: z.string(),
        quantity: z.number(),
    }),
});

type AddItemsToShoppingCartProps = z.infer<typeof addItemsToShoppingCartCartPropsSchema>;

export async function addItemToShoppingCart(
    updateShoppingCartProps: AddItemsToShoppingCartProps
): Promise<{
    result: "added" | "not-enough-tickets";
}> {
    console.info("Adding item to shopping cart", updateShoppingCartProps);

    const validatesShoppingCart = addItemsToShoppingCartCartPropsSchema.parse(
        updateShoppingCartProps
    );

    const {items, shoppingCartId} = validatesShoppingCart;

    const result = await shoppingCart.addItems(
        shoppingCartId,
        items.itemId,
        items.quantity
    );

    revalidatePath("/tickets");

    return result;
}

const removeShoppingCartItemSchema = z.object({
    shoppingCartId: z.string(),
    itemId: z.string(),
});

type RemoveShoppingCartItemProps = z.infer<typeof removeShoppingCartItemSchema>;

export async function removeItemFromShoppingCart(
    removeShoppingCartItemProps: RemoveShoppingCartItemProps
): Promise<void> {
    console.info("Removing item from shopping cart", removeShoppingCartItemProps);

    const validatedRequest = removeShoppingCartItemSchema.parse(
        removeShoppingCartItemProps
    );

    const {itemId, shoppingCartId} = validatedRequest;

    await shoppingCart.removeItem(shoppingCartId, itemId);

    revalidatePath("/tickets");
}

const updateShoppingCartProps = z.object({
    shoppingCartId: z.string(),
    items: z.array(z.object({
        itemId: z.string(),
        guestDetails: z.object({
            guestName: z.string().optional(),
            companyName: z.string().optional(),
            position: z.string().optional(),
        })
    }))
})

type UpdateShoppingCartProps = z.infer<typeof updateShoppingCartProps>;

export async function updateItemsInShoppingCart(updateShoppingCartProps: UpdateShoppingCartProps): Promise<void> {
    console.info("Updating items in shopping cart with ticket details", updateShoppingCartProps);
    const {shoppingCartId, items} = updateShoppingCartProps;
    await shoppingCart.updateCartItemsWithguestDetails(shoppingCartId, items);

    revalidatePath("/tickets");
}
