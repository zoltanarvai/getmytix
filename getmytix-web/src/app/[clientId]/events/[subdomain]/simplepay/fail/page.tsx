import { notFound } from "next/navigation";
import { payment, events } from "@/lib/domain";
import { BackButton, PageTitles } from "@/components/molecules";

type PaymentFailedProps = {
  params: { subdomain: string };
  searchParams: {
    r: string;
    s: string;
  };
};

export default async function PaymentFailed({
  params: { subdomain },
  searchParams: { r, s },
}: PaymentFailedProps) {
  const event = await events.getEventBySubdomain(subdomain);
  const paymentResult = payment.getPaymentResponse(r, s);

  if (!event) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
      <PageTitles title={event.name} subtitle="Sikertelen jegyvásárlás" />

      <section className="flex flex-col items-center justify-center mt-6 text-center">
        <span className="font-bold">Sajnáljuk, a fizetés sikertelen volt.</span>
        <span className="mt-2 w-2/3">
          Kérjük, ellenőrizze a tranzakció során megadott adatok helyességét.
          Amennyiben minden adatot helyesen adott meg, a visszautasítás okának
          kivizsgálása érdekében kérjük, szíveskedjen kapcsolatba lépni
          kártyakibocsátó bankjával.
        </span>
        <span className="mt-2">
          (Megrendelési azonosító: {paymentResult.orderId})
        </span>
        <span className="mb-4">
          (Tranzakciós azonosító: {paymentResult.transactionId})
        </span>
        <BackButton title="Újrapróbálom" />
      </section>
    </main>
  );
}
