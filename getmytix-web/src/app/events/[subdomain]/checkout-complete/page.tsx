import { notFound } from "next/navigation";
import { getEvent } from "@/lib/domain/events";
import { orders, payment, shoppingCart } from "@/lib/domain";
import { Order } from "@/lib/domain/orders";

type CheckoutCompleteProps = {
  params: { subdomain: string };
  searchParams: {
    r: string;
    s: string;
  };
};

export default async function CheckoutComplete({
  params: { subdomain },
  searchParams: { r, s },
}: CheckoutCompleteProps) {
  const event = await getEvent(subdomain);
  const response = payment.getValidatedResponse(r, s);
  const orderRecord = await orders.repository.getOrder(response.orderId);

  if (!orderRecord) {
    return notFound();
  }

  if (!event) {
    return notFound();
  }

  if (!Order.isPaid(orderRecord)) {
    await Order.fulfill(response.orderId);
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <section className="flex self-center flex-col mt-20 items-center">
        <h1 className="text-6xl font-bold tracking-tight">{event.name}</h1>
        <h2 className="text-2xl text-gray-500 mt-2 text-center">
          Sikeres jegyvásárlás
        </h2>
      </section>

      <section className="flex flex-col items-center justify-center mt-6 text-center">
        Köszönjünk, sikeresen feldolgoztuk a megrendelésed. <br />
        <span className="font-bold">(Azonosító: {response.orderId})</span>
        <br /> A jegyedet a megadott email címre küldtük el.
      </section>
    </main>
  );
}
