import { notFound } from "next/navigation";
import { orders, payment, events } from "@/lib/domain";
import { PageTitles } from "@/components/molecules";

type PaymentCancelledProps = {
  params: { subdomain: string };
  searchParams: {
    r: string;
    s: string;
  };
};

export default async function PaymentCancelled({
  params: { subdomain },
  searchParams: { r, s },
}: PaymentCancelledProps) {
  const event = await events.getEventBySubdomain(subdomain);
  const paymentResult = payment.getPaymentResponse(r, s);
  const order = await orders.getOrder(paymentResult.orderId);

  if (!event) {
    return notFound();
  }

  if (!order) {
    throw new Error("Order not found");
  }

  if (!orders.isCancelled(order)) {
    await orders.cancel(
      paymentResult.orderId,
      paymentResult.transactionId,
      "simplepay"
    );
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle="Sikertelen jegyvásárlás" />

      <section className="flex flex-col items-center justify-center mt-6 text-center">
        Sajnáljuk, hogy a fizetés megszakítása mellett döntött. <br />
        <span className="font-bold">
          (Megrendelési azonosító: {paymentResult.orderId})
        </span>
        <br /> A megrendelését töröltük.
      </section>
    </main>
  );
}
