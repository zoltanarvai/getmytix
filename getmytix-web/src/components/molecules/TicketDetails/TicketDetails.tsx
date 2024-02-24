"use client"

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";

type DetailsProps = {
    index: number,
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

    const onGuestNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Card className="flex flex-col bg-gray-100 pt-4">
            <CardTitle className="text-xl ml-4">
                <p className="font-bold">{props.index + 1}. {props.shoppingCartItem.ticketType} Jegy</p>
            </CardTitle>
            <CardContent className="flex gap-3 mt-2 max-md:flex-col">
                <div>
                    <Label>Vendég neve</Label>
                    <Input
                        maxLength={200}
                        placeholder="Vendég neve"
                        className="text-md w-full"
                        value={guestName}
                        onChange={onGuestNameChanged}
                    />
                </div>
                <div>
                    <Label>Cég neve</Label>
                    <Input
                        maxLength={200}
                        placeholder="Cég neve"
                        className="text-md w-full"
                        value={companyName}
                        onChange={onCompanyNameChanged}
                    />
                </div>
                <div>
                    <Label>Betöltött pozíció</Label>
                    <Input
                        maxLength={200}
                        placeholder="Betöltött pozíció"
                        className="text-md w-full"
                        value={position}
                        onChange={onPositionChanged}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
