import * as R from "remeda";
import { notFound } from "next/navigation";
import { events, shoppingCart } from "@/lib/domain";
import { getSessionId } from "@/lib/domain/session";
import { ShoppingCart, SubmitOrder } from "@/components/organisms";

type CheckoutProps = {
  params: {
    subdomain: string;
    cartId: string;
  };
};

export default async function Checkout({
  params: { subdomain, cartId },
}: CheckoutProps) {
  const sessionId = getSessionId();
  const event = await events.getEvent(subdomain);

  if (!sessionId || !event) {
    return notFound();
  }

  const shoppingCartItems =
    await shoppingCart.ShoppingCart.getShoppingCartItems(cartId);

  const ticketsInShoppingCart = R.pipe(
    shoppingCartItems,
    R.map(({ itemId }) => event.ticketTypes.find(({ id }) => id === itemId)),
    R.filter((ticketType) => !!ticketType),
    R.groupBy((ticketType) => ticketType!.id)
  );

  return (
    <main className="flex flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-center flex-col mt-20 items-center">
        <h1 className="text-6xl font-bold tracking-tight">{event.name}</h1>
        <h2 className="text-2xl text-gray-500 mt-2 text-center">
          {event.description}
        </h2>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center m-8">
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

        <SubmitOrder
          sessionId={sessionId}
          subdomain={event.subdomain}
          shoppingCartId={cartId}
        />
      </section>
    </main>
  );
}
