import dayjs from "dayjs";
import * as uuid from "uuid";
import * as R from "remeda";
import * as orders from "../orders";
import * as events from "../events";
import * as services from "./services";
import * as repository from "./repository";

const HTTP_SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

export async function generateInvoice(
    order: orders.Order,
    event: events.Event
): Promise<void> {
    console.info("Generating invoice for order", order.id);
    const domain = event.clientInfo.domain;
    const clientSlug = event.clientInfo.slug;

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
                quantity: group.length,
                unitPrice: ticketType.price,
            };
        })
    );

    const {name, street, streetNumber, city, zip, email, taxNumber} = order.customerDetails;

    const newInvoiceUniqueId = uuid.v4();
    const newInvoice = await repository.createInvoice({
        orderId: order.id,
        invoiceUniqueId: newInvoiceUniqueId,
        invoiceDate: dayjs().format("YYYY-MM-DD"),
        invoicePrefix: "FITIX", // TODO get this from client data
        seller: {
            bank: "MKB BANK ZRT. SWIFT KÓD: MKKBHUHB",
            accountNumber: "HU60 10300002-20108698-48820019",
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
        invoiceCallbackUrl: `${HTTP_SCHEME}://${domain}/api/${clientSlug}/invoices/${newInvoiceUniqueId}`,
    });

    const {_id, ...rest} = newInvoice;

    await services.generateInvoice({
        id: _id.toHexString(),
        ...rest
    });

    console.info("Generated invoice items", invoiceItems);
}
