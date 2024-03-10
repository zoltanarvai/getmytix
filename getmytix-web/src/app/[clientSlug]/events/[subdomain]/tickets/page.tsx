import {notFound} from "next/navigation";
import {TicketSelector} from "@/components/organisms";
import {events, session, shoppingCart} from "@/lib/domain";
import {PageTitles, ShoppingCartSubmit} from "@/components/molecules";
import React from "react";

type TicketProps = {
    params: {
        subdomain: string;
    };
};

export default async function Tickets({params: {subdomain}}: TicketProps) {
    const event = await events.getEventBySubdomain(subdomain);
    const sessionId = session.getCurrentSessionId();

    if (!event) {
        return notFound();
    }

    if (!sessionId) {
        throw new Error("No session has been established");
    }

    const initialisedShoppingCart = await shoppingCart.initialize(
        sessionId,
        subdomain
    );

    const availableQuantityPerTicketType =
        await events.getAvailableQuantityPerTicketType(event.id);

    const availabeTicketTypes = event.ticketTypes
        .filter(type => !type.hidden)
        .map((ticketType) => ({
                ...ticketType,
                availableQuantity: availableQuantityPerTicketType[ticketType.id],
                totalQuantity: ticketType.quantity,
            })
        );

    return (
        <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
            <PageTitles title={event.name} subtitle={event.description}/>

            <section className="flex flex-1 flex-col items-center justify-center mb-8 gap-8">
                <TicketSelector
                    event={{
                        ...event,
                        availabeTicketTypes,
                    }}
                    shoppingCartId={initialisedShoppingCart.id}
                    shoppingCartItems={initialisedShoppingCart.items}
                />
                <ShoppingCartSubmit enabled={initialisedShoppingCart.items.length > 0}
                                    shoppingCartId={initialisedShoppingCart.id}/>
            </section>
        </main>
    );
}
