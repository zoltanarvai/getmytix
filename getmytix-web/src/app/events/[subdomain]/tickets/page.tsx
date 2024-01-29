import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/domain/events";
import { TicketSelector } from "@/components/organisms";
import { Button } from "@/components/ui/button";
import { getSessionId } from "@/lib/domain/session";
import { shoppingCart } from "@/lib/domain";

type TicketProps = {
  params: {
    subdomain: string;
  };
};

export default async function Tickets({ params: { subdomain } }: TicketProps) {
  const event = await getEvent(subdomain);
  const sessionId = getSessionId();

  if (!event || !sessionId) {
    return notFound();
  }

  const shoppingCartId = await shoppingCart.ShoppingCart.initialize(
    sessionId,
    subdomain
  );

  const tickets = await shoppingCart.ShoppingCart.getTickets(shoppingCartId);

  return (
    <main className="flex flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-center flex-col mt-20 items-center">
        <h1 className="text-6xl font-bold tracking-tight">{event.name}</h1>
        <h2 className="text-2xl text-gray-500 mt-2 text-center">
          {event.description}
        </h2>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center m-8">
        <TicketSelector
          event={{
            ...event,
            ticketTypes: event.ticketTypes.map((ticketType) => ({
              ...ticketType,
              quantityInShoppingCart: tickets[ticketType.id] || 0,
            })),
          }}
          shoppingCartId={shoppingCartId}
        />

        <Link className="mt-8" href={`checkout/${shoppingCartId}`}>
          <Button
            className="text-xl font-bold rounded-full px-6 py-6"
            disabled={Object.keys(tickets).length == 0}
          >
            Fizetés
          </Button>
        </Link>
      </section>
    </main>
  );
}
