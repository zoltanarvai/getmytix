"use client"

import React, {useTransition} from "react";
import {Button} from "@/components/ui/button";
import {updateItemsInShoppingCart} from "@/app/server-actions/shopping-cart";
import {useRouter} from "next/navigation";
import {TickeDetails} from "@/components/molecules";

type TicketDetailsFormProps = {
    subdomain: string;
    clientSlug: string;
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
    const [isPending, setTransitioning] = useTransition();

    const onClick = async () => {
        const items = props.shoppingCartItems.map(item => ({
            itemId: item.itemId,
            guestDetails: {
                guestName: item.guestName,
                companyName: item.companyName,
                position: item.position
            }
        }))

        setTransitioning(async () => {
            await updateItemsInShoppingCart({
                shoppingCartId: props.shoppingCartId,
                items,
            });
        })

        router.push(`/events/${props.subdomain}/checkout/${props.shoppingCartId}`)
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
            <Button className="text-xl font-bold px-6 py-6 mt-4 max-w-64 self-center"
                    aria-disabled={isPending}
                    onClick={onClick}>Tovább a Fizetéshez</Button>
        </div>
    )
}