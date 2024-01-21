import { notFound } from "next/navigation";
import { events, shoppingCarts } from "@/lib/domain";
import { getSessionId } from "@/lib/domain/session";

type CheckoutProps = {
  params: {
    eventId: string;
  };
};

export default async function Checkout({ params: { eventId } }: CheckoutProps) {
  const sessionId = getSessionId();
  const event = await events.getEvent(eventId);

  if (!sessionId || !event) {
    return notFound();
  }

  const shoppingCart = await shoppingCarts.getShoppingCart(sessionId, event.id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to my Checkout!</h1>
      <div>{JSON.stringify(shoppingCart, null, 4)}</div>
    </main>
  );
}
