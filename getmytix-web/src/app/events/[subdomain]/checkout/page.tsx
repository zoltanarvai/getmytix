import Link from "next/link";
import { notFound } from "next/navigation";
import { events, shoppingCarts } from "@/lib/domain";
import { getSessionId } from "@/lib/domain/session";
import { ShoppingCart } from "@/components/organisms";
import { Button } from "@/components/ui/button";

type CheckoutProps = {
  params: {
    subdomain: string;
  };
};

export default async function Checkout({
  params: { subdomain },
}: CheckoutProps) {
  const sessionId = getSessionId();
  const event = await events.getEvent(subdomain);

  if (!sessionId || !event) {
    return notFound();
  }

  const shoppingCart = await shoppingCarts.getShoppingCart(sessionId, event.id);

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
              quantityInShoppingCart: shoppingCart!.tickets[ticketType.id] || 0,
            })),
          }}
        />

        <Link className="mt-8" href={`checkout`}>
          <Button className="text-xl font-bold rounded-full px-6 py-6">
            Fizetés
          </Button>
        </Link>
      </section>
    </main>
  );
}
