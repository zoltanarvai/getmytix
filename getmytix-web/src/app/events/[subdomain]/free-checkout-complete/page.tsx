import { notFound } from "next/navigation";
import { orders, events } from "@/lib/domain";
import { PageTitles } from "@/components/molecules";

type CheckoutCompleteProps = {
  params: { subdomain: string };
  searchParams: {
    orderId: string;
  };
};

export default async function CheckoutComplete({
  params: { subdomain },
  searchParams: { orderId },
}: CheckoutCompleteProps) {
  const event = await events.getEventBySubdomain(subdomain);
  const order = await orders.getOrder(orderId);

  if (!event) {
    return notFound();
  }

  if (!order) {
    throw new Error("Order not found");
  }

  if (!orders.isPaid(order)) {
    // equivalent to processing
    await orders.fulfill(orderId);
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle="Sikeres jegyvásárlás" />

      <section className="flex flex-col items-center justify-center mt-6 text-center">
        Köszönjünk, sikeresen feldolgoztuk a megrendelésed. <br />
        <span className="font-bold">(Azonosító: {orderId})</span>
        <br /> A jegyedet a megadott email címre küldtük el.
      </section>
    </main>
  );
}
