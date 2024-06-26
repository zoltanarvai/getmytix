"use server";

import {z} from "zod";
import {clients, customers, orders, payment, session} from "@/lib/domain";

const SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

const createOrderSchema = z.object({
    customerDetails: z.object({
        email: z.string(),
        name: z.string(),
        street: z.string(),
        streetNumber: z.string(),
        city: z.string(),
        zip: z.string(),
        state: z.string(),
        country: z.string(),
        phone: z.string().optional(),
        taxNumber: z.string().optional(),
    }),
    subdomain: z.string(),
    clientSlug: z.string(),
    clientDomain: z.string(),
    shoppingCartId: z.string(),
});

type CreateOrderProps = z.infer<typeof createOrderSchema>;

export async function createOrder(
    createOrderRequest: CreateOrderProps
): Promise<{
    redirectUrl: string;
    mode: "payment" | "confirmation";
}> {
    console.info("Creating order", createOrderRequest);
    const domain = createOrderRequest.clientDomain || "localhost:3000";

    const validRequest = createOrderSchema.parse(createOrderRequest);

    const currentSessionId = session.getCurrentSessionId();
    if (!currentSessionId) {
        throw new Error("No active session found");
    }

    const currentSession = await session.getSession(currentSessionId);
    if (!currentSession) {
        throw new Error("Session not found");
    }

    let customer = await customers.getCustomerByEmail(createOrderRequest.customerDetails.email);
    if (!customer) {
        customer = await customers.createCustomer(createOrderRequest.customerDetails.email);
    }

    await session.updateSessionWithCustomer(currentSessionId, customer.id);

    const client = await clients.getClientBySlug(validRequest.clientSlug);
    if (!client) {
        throw new Error("Client not found");
    }

    // At this point the shopping cart is already created explaining which ticket type the user wants to buy
    // and how many. Tickets are not reserved yet.
    const orderId = await orders.createOrder(validRequest.shoppingCartId, client.id, {
        id: customer.id,
        name: validRequest.customerDetails.name,
        email: customer.email,
        street: validRequest.customerDetails.street,
        streetNumber: validRequest.customerDetails.streetNumber,
        city: validRequest.customerDetails.city,
        zip: validRequest.customerDetails.zip,
        state: validRequest.customerDetails.state,
        country: validRequest.customerDetails.country,
        phone: validRequest.customerDetails.phone,
        taxNumber: validRequest.customerDetails.taxNumber,
    });

    // We know the total amount based on the basket value and what's being ordered
    const totalAmount = await orders.calculateTotalOrderValue(orderId);

    if (totalAmount === 0) {
        console.info("Order is free, skipping payment");

        return {
            redirectUrl: `/${validRequest.clientSlug}/events/${validRequest.subdomain}/free-checkout-complete?orderId=${orderId}`,
            mode: "confirmation",
        };
    }

    console.info("Order is contains non-free tickets, creating payment");

    // Kick off Payment
    const paymentResponse = await payment.createPayment({
        orderId: orderId,
        customerEmail: customer.email,
        amount: totalAmount.toString(),
        redirectBaseUrl: `${SCHEME}://${domain}/events/${validRequest.subdomain}`,
        invoiceDetails: {
            name: validRequest.customerDetails.name,
            company: "",
            country: validRequest.customerDetails.country,
            state: validRequest.customerDetails.state,
            city: validRequest.customerDetails.city,
            zip: validRequest.customerDetails.zip,
            address: `${validRequest.customerDetails.street} ${validRequest.customerDetails.streetNumber}`,
        },
    });

    return {
        redirectUrl: paymentResponse.paymentUrl,
        mode: "payment",
    };
}
