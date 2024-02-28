import * as R from "remeda";
import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {events, session, shoppingCart} from "@/lib/domain";
import {ShoppingCart, SubmitOrder} from "@/components/organisms";
import {PageSection, PageTitles} from "@/components/molecules";

type CheckoutProps = {
    params: {
        subdomain: string;
        cartId: string;
    };
};

export default async function Checkout({
                                           params: {subdomain, cartId},
                                       }: CheckoutProps) {
    const sessionId = session.getCurrentSessionId();
    const event = await events.getEventBySubdomain(subdomain);

    if (!sessionId || !event) {
        return notFound();
    }

    const shoppingCartItems = await shoppingCart.getShoppingCartItems(cartId);

    const ticketsInShoppingCart = R.pipe(
        shoppingCartItems,
        R.map(({itemId}) => event.ticketTypes.find(({id}) => id === itemId)),
        R.filter((ticketType) => !!ticketType),
        R.groupBy((ticketType) => ticketType!.id)
    );

    return (
        <main className="flex flex-col max-w-screen-lg m-auto gap-2">
            <PageTitles title={event.name} subtitle={event.description}/>

            <PageSection title="Kosaram">
                <ShoppingCart
                    event={{
                        ...event,
                        ticketTypes: event.ticketTypes.map((ticketType) => ({
                            ...ticketType,
                            quantityInShoppingCart:
                                ticketsInShoppingCart[ticketType.id]?.length || 0,
                        })),
                    }}
                />
            </PageSection>

            <PageSection title="Vásárló adatai" classNames="mt-8">
                <SubmitOrder subdomain={event.subdomain} shoppingCartId={cartId} clientSlug={event.clientInfo.slug}
                             clientDomain={event.clientInfo.domain}/>
            </PageSection>

            <div className="self-end">
                <Link
                    href="https://simplepartner.hu/PaymentService/Fizetesi_tajekoztato.pdf"
                    target="_blank"
                >
                    <Image
                        src="/simplepay.png"
                        title="SimplePay - Online bankkártyás fi
              zetés"
                        alt=" SimplePay vásárlói tájékoztató"
                        width={197}
                        height={197}
                    />
                </Link>
            </div>
        </main>
    );
}
