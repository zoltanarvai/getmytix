import dayjs from "dayjs";
import * as uuid from "uuid";
import * as R from "remeda";
import * as orders from "../orders";
import * as events from "../events";
import * as clients from "../clients";
import * as services from "./services";
import * as repository from "./repository";

const HTTP_SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

export async function generateInvoice(
    order: orders.Order,
    event: events.Event,
    client: clients.Client,
): Promise<void> {
    console.info("Generating invoice for order", order.id);
    const domain = client.domain;

    const getTicketType = (ticketId: string) => {
        const ticketType = event.ticketTypes.find(
            (ticketType) => ticketType.id === ticketId
        );

        if (!ticketType) {
            throw new Error(`Ticket type ${ticketId} not found in event ${event.id}`);
        }

        return ticketType;
    };

    const invoiceItems = R.pipe(
        order.items,
        R.groupBy((ticket) => ticket.itemId),
        Object.entries,
        R.map(([key, group]) => {
            const ticketType = getTicketType(key);

            return {
                itemId: ticketType.id,
                itemType: ticketType.type,
                itemTitle: `${event.name} - ${ticketType.type} Jegy`,
                quantity: group.length,
                unitPrice: ticketType.price,
                containsProxyService: ticketType.containsProxyService,
                comment: ticketType.containsProxyService ? `ebből catering: ${ticketType.proxyServiceValue} Ft + 27% ÁFA` : undefined,
            };
        })
    );

    const {name, street, streetNumber, city, zip, email, taxNumber} = order.customerDetails;

    const containsProxyService = invoiceItems.some(p => p.containsProxyService);
    const newInvoiceUniqueId = uuid.v4();
    const newInvoice = await repository.createInvoice({
        orderId: order.id,
        invoiceUniqueId: newInvoiceUniqueId,
        invoiceDate: dayjs().format("YYYY-MM-DD"),
        invoicePrefix: client.invoicePrefix,
        comment: containsProxyService ? "A számla közvetített szolgáltatást tartalmaz." : undefined,
        seller: {
            bank: client.bank,
            accountNumber: client.accountNumber,
        },
        billingDetails: {
            name,
            taxNumber,
            address: `${street} ${streetNumber}`,
            email,
            city,
            zip,
        },
        items: invoiceItems,
        invoiceCallbackUrl: `${HTTP_SCHEME}://${domain}/api/invoices/${newInvoiceUniqueId}`,
    });

    const {_id, ...rest} = newInvoice;

    await services.generateInvoice({
        id: _id.toHexString(),
        ...rest
    });

    console.info("Generated invoice items", invoiceItems);
}
