import {notFound} from "next/navigation";
import {clients, events, shoppingCart} from "@/lib/domain";
import {PageSection, PageTitles} from "@/components/molecules";
import {TicketDetailsForm} from "@/components/organisms/TicketDetailsForm/TicketDetailsForm";

type TicketDetailsProps = {
    params: {
        subdomain: string;
        cartId: string;
    };
};

export default async function TicketDetails({params: {subdomain, cartId}}: TicketDetailsProps) {
    const event = await events.getEventBySubdomain(subdomain);
    if (!event) {
        return notFound();
    }

    const client = await clients.getClientById(event.clientInfo.id);
    if (!client) {
        return notFound();
    }

    const shoppingCartItems = await shoppingCart.getShoppingCartItems(cartId);

    const items = shoppingCartItems.map(item => ({
        ...item,
        ticketType: event.ticketTypes.find(ticketType => ticketType.id === item.itemId)!.type
    }))

    return (
        <main className="flex flex-col min-h-screen max-w-screen-lg m-auto gap-2">
            <PageTitles title={event.name} subtitle={event.description}/>

            <PageSection title="Jegyek">
                <TicketDetailsForm shoppingCartItems={items} shoppingCartId={cartId} subdomain={event.subdomain}
                                   clientSlug={client.slug}/>
            </PageSection>
        </main>
    );
}
