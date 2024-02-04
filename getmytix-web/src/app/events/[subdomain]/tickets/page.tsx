import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketSelector } from "@/components/organisms";
import { Button } from "@/components/ui/button";
import { session, events, shoppingCart } from "@/lib/domain";
import { PageTitles } from "@/components/molecules";

type TicketProps = {
  params: {
    subdomain: string;
  };
};

export default async function Tickets({ params: { subdomain } }: TicketProps) {
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

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle={event.description} />

      <section className="flex flex-1 flex-col items-center justify-center mb-8">
        <TicketSelector
          event={{
            ...event,
            availabeTicketTypes: event.ticketTypes.map((ticketType) => ({
              ...ticketType,
              availableQuantity: availableQuantityPerTicketType[ticketType.id],
              totalQuantity: ticketType.quantity,
            })),
          }}
          shoppingCartId={initialisedShoppingCart.id}
          shoppingCartItems={initialisedShoppingCart.items}
        />

        <Link className="mt-8" href={`checkout/${initialisedShoppingCart.id}`}>
          <Button
            className="text-xl px-6 py-6"
            disabled={initialisedShoppingCart.items.length == 0}
          >
            Tovább a fizetéshez
          </Button>
        </Link>
      </section>
    </main>
  );
}
