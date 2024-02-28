import { notFound } from "next/navigation";
import { payment, events } from "@/lib/domain";
import { BackButton, PageTitles } from "@/components/molecules";

type PaymentTimeoutProps = {
  params: { subdomain: string };
  searchParams: {
    r: string;
    s: string;
  };
};

export default async function PaymentTimeout({
  params: { subdomain },
  searchParams: { r, s },
}: PaymentTimeoutProps) {
  const event = await events.getEventBySubdomain(subdomain);
  const paymentResult = payment.getPaymentResponse(r, s);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle="Sikertelen jegyvásárlás" />

      <section className="flex flex-col items-center justify-center mt-6 text-center">
        <span className="font-bold">
          Sajnáljuk, Ön túllépte a tranzakció elindításának lehetséges maximális
          idejét.
        </span>
        <span className="mt-2 mb-4">
          (Megrendelési azonosító: {paymentResult.orderId})
        </span>
        <BackButton title="Újrapróbálom" />
      </section>
    </main>
  );
}
