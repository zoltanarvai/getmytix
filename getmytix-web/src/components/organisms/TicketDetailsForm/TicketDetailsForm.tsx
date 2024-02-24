"use client"

import React from "react";
import {Button} from "@/components/ui/button";
import {updateItemsInShoppingCart} from "@/app/server-actions/shopping-cart";
import {useRouter} from "next/navigation";
import {TickeDetails} from "@/components/molecules";

type TicketDetailsFormProps = {
    shoppingCartId: string;
    shoppingCartItems: {
        itemId: string;
        ticketType: string;
        guestName?: string;
        companyName?: string;
        position?: string;
    }[]
}

export function TicketDetailsForm(props: TicketDetailsFormProps) {
    const router = useRouter();

    const onClick = async () => {
        const items = props.shoppingCartItems.map(item => ({
            itemId: item.itemId,
            guestDetails: {
                guestName: item.guestName,
                companyName: item.companyName,
                position: item.position
            }
        }))

        await updateItemsInShoppingCart({
            shoppingCartId: props.shoppingCartId,
            items,
        })

        router.push(`/checkout/${props.shoppingCartId}`)
    }

    return (
        <div className="flex flex-col gap-4">
            {props.shoppingCartItems.map((item, index) => (
                <TickeDetails key={index} index={index} shoppingCartItem={item} onItemChanged={(updatedItem) => {
                    item.guestName = updatedItem.guestName;
                    item.companyName = updatedItem.companyName;
                    item.position = updatedItem.position;
                }}/>
            ))}
            <Button className="text-xl font-bold rounded-full px-6 py-6 mt-4 max-w-64 self-center"
                    onClick={onClick}>Tovább a Fizetéshez</Button>
        </div>
    )
}