import * as R from "remeda";
import { notFound } from "next/navigation";
import { events, shoppingCart, session } from "@/lib/domain";
import { ShoppingCart, SubmitOrder } from "@/components/organisms";
import { PageSection, PageTitles } from "@/components/molecules";

type CheckoutProps = {
  params: {
    subdomain: string;
    cartId: string;
  };
};

export default async function Checkout({
  params: { subdomain, cartId },
}: CheckoutProps) {
  const sessionId = session.getCurrentSessionId();
  const event = await events.getEventBySubdomain(subdomain);

  if (!sessionId || !event) {
    return notFound();
  }

  console.log(">>>>> event", event);
  console.log(">>>>> sessionId", sessionId);
  console.log(">>>>> cartId", cartId);

  const shoppingCartItems = await shoppingCart.getShoppingCartItems(cartId);

  const ticketsInShoppingCart = R.pipe(
    shoppingCartItems,
    R.map(({ itemId }) => event.ticketTypes.find(({ id }) => id === itemId)),
    R.filter((ticketType) => !!ticketType),
    R.groupBy((ticketType) => ticketType!.id)
  );

  return (
    <main className="flex flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle={event.description} />

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
        <SubmitOrder subdomain={event.subdomain} shoppingCartId={cartId} />
      </PageSection>
    </main>
  );
}
