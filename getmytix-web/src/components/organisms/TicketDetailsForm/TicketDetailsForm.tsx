"use client"

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {updateItemsInShoppingCart} from "@/app/server-actions/shopping-cart";
import {useRouter} from "next/navigation";

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

type DetailsProps = {
    shoppingCartItem: {
        itemId: string;
        ticketType: string;
        guestName?: string;
        companyName?: string;
        position?: string;
    }
    onItemChanged(item: {
        itemId: string;
        ticketType: string;
        guestName?: string;
        companyName?: string;
        position?: string;
    }): void
}

export function TickeDetails(props: DetailsProps) {
    const [guestName, setguestName] = useState(props.shoppingCartItem.guestName || "");
    const [companyName, setCompanyName] = useState(props.shoppingCartItem.companyName || "");
    const [position, setPosition] = useState(props.shoppingCartItem.position || "");

    const onguestNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onItemChanged({
            itemId: props.shoppingCartItem.itemId,
            ticketType: props.shoppingCartItem.ticketType,
            guestName: e.target.value,
            companyName,
            position,
        });

        setguestName(e.target.value);
    }

    const onCompanyNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onItemChanged({
            itemId: props.shoppingCartItem.itemId,
            ticketType: props.shoppingCartItem.ticketType,
            guestName,
            companyName: e.target.value,
            position,
        });

        setCompanyName(e.target.value);
    }

    const onPositionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onItemChanged({
            itemId: props.shoppingCartItem.itemId,
            ticketType: props.shoppingCartItem.ticketType,
            guestName,
            companyName,
            position: e.target.value
        });

        setPosition(e.target.value);
    }

    return (
        <div>
            <p>{props.shoppingCartItem.ticketType}</p>
            <Input
                placeholder="Nev"
                className="text-center text-md"
                value={guestName}
                onChange={onguestNameChanged}
            />
            <Input
                placeholder="Ceg nev"
                className="text-center text-md"
                value={companyName}
                onChange={onCompanyNameChanged}
            />
            <Input
                placeholder="Pozicio"
                className="text-center text-md"
                value={position}
                onChange={onPositionChanged}
            />
        </div>
    )
}

export function TicketDetailsForm(props: TicketDetailsFormProps) {
    const router = useRouter();

    const onClick = async () => {
        props.shoppingCartItems.forEach(item => {
            console.log(item.guestName, item.companyName, item.position);
        });

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
        <>
            {props.shoppingCartItems.map((item, index) => (
                <TickeDetails key={index} shoppingCartItem={item} onItemChanged={(updatedItem) => {
                    item.guestName = updatedItem.guestName;
                    item.companyName = updatedItem.companyName;
                    item.position = updatedItem.position;
                }}/>
            ))}
            <Button onClick={onClick}>Tovabb a Fizeteshez</Button>
        </>
    )
}