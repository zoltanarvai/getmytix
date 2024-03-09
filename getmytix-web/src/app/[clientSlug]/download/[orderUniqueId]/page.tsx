import {notFound} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {PageTitles} from "@/components/molecules";
import {clients, events, orders, tickets} from "@/lib/domain";

const HTTP_SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

type DownloadTicketsProps = {
    params: {
        orderUniqueId: string;
    };
};


export default async function DownloadTickets(props: DownloadTicketsProps) {
    const {params: {orderUniqueId}} = props;

    let order = null;

    try {
        order = await orders.getOrderByUniqueId(orderUniqueId);
    } catch (e: any) {
        console.warn(e.message)
    }

    if (!order) {
        return notFound()
    }

    const event = await events.getEventById(order.eventId)
    if (!event) {
        return notFound()
    }

    const client = await clients.getClientById(event.clientInfo.id);
    if (!client) {
        return notFound();
    }

    const ticketsFromOrder = await tickets.getTicketsByOrderId(order.id);

    return (
        <main className="flex min-h-screen flex-col max-w-screen-lg m-auto gap-2">
            <PageTitles title={event.name} subtitle="Töltsd le a jegyeket!"/>

            <section className="flex items-center justify-center">
                <div className="flex flex-col gap-2">
                    {ticketsFromOrder.map((ticket, index) => (
                        <Link key={ticket.id}
                              href={`${HTTP_SCHEME}://${client.domain}/api/download/${ticket.ticketUniqueId}`}>
                            <Button className="w-full">
                                {ticket.details.ticketType.type} Jegy {index + 1}
                                {ticket.details.guest.guestName ? ` - ${ticket.details.guest.guestName}` : ""}
                            </Button>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}