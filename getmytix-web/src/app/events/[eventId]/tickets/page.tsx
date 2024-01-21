import { notFound } from "next/navigation";
import { getEvent } from "@/lib/domain/events";
import { TicketSelector } from "@/components/organisms";
import { Button } from "@/components/ui/button";
import { getSessionId } from "@/lib/domain/session";
import { shoppingCarts } from "@/lib/domain";
import Link from "next/link";

type TicketProps = {
  params: {
    eventId: string;
  };
};

export default async function Tickets({ params: { eventId } }: TicketProps) {
  const event = await getEvent(eventId);

  if (!event) {
    return notFound();
  }

  let sessionId = getSessionId();
  if (!sessionId) {
    return notFound();
  }

  let shoppingCart = await shoppingCarts.getShoppingCart(sessionId, event.id);
  if (!shoppingCart) {
    shoppingCart = await shoppingCarts.createShoppingCart(sessionId, event.id);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{event.name}</h1>
      <TicketSelector
        event={{
          ...event,
          ticketTypes: event.ticketTypes.map((ticketType) => ({
            ...ticketType,
            quantityInShoppingCart: shoppingCart!.tickets[ticketType.id] || 0,
          })),
        }}
        sessionId={sessionId}
      />
      <Link href={`checkout`}>
        <Button>Checkout</Button>
      </Link>
    </main>
  );
}
