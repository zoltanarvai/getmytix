import {notFound} from "next/navigation";
import {events, orders, payment} from "@/lib/domain";
import {PageTitles} from "@/components/molecules";

type PaymentSuccessfulProps = {
    params: { subdomain: string };
    searchParams: {
        r: string;
        s: string;
    };
};

export default async function PaymentSuccessful({
                                                    params: {subdomain},
                                                    searchParams: {r, s},
                                                }: PaymentSuccessfulProps) {
    const event = await events.getEventBySubdomain(subdomain);
    const paymentResult = payment.getPaymentResponse(r, s);
    const order = await orders.getOrder(paymentResult.orderId);

    if (!event) {
        return notFound();
    }

    if (!order) {
        throw new Error("Order not found");
    }

    await orders.fulfill(
        paymentResult.orderId,
        paymentResult.transactionId,
        "simplepay"
    );

    return (
        <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
            <PageTitles title={event.name} subtitle="Sikeres jegyvásárlás"/>

            <section className="flex flex-col items-center justify-center mt-6 text-center">
        <span className="font-bold">
          A jegyeket a megadott email címre küldjük el.
        </span>
                <span className="mt-2">
          Ellenőrizze a Spam és a Levélszemét mappákat is. Előfordulhat, hogy a jegyeket tartalmazó e-mail oda érkezik.
        </span>
                <span className="mt-2">
          (Megrendelési azonosító: {paymentResult.orderId})
        </span>
                <span className="mb-4">
          (Tranzakciós azonosító: {paymentResult.transactionId})
        </span>
            </section>
        </main>
    );
}
