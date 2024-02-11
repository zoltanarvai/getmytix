"use server";

import { z } from "zod";
import { orders, payment, session, customers } from "@/lib/domain";

const HOST = process.env.HOST || "localhost:3000";
const SCHEME = process.env.NODE_ENV === "production" ? "https" : "http";

const createOrderSchema = z.object({
  customerDetails: z.object({
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  subdomain: z.string(),
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

  const validRequest = createOrderSchema.parse(createOrderRequest);

  const currentSessionId = session.getCurrentSessionId();
  if (!currentSessionId) {
    throw new Error("No active session found");
  }

  const currentSession = await session.getSession(currentSessionId);
  if (!currentSession) {
    throw new Error("Session not found");
  }

  const customer = await customers.getCustomerById(currentSession.customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // At this point the shopping cart is already created explaining which ticket type the user wants to buy
  // and how many. Tickets are not reserved yet.
  const orderId = await orders.createOrder(validRequest.shoppingCartId, {
    ...validRequest.customerDetails,
    ...customer,
  });

  // We know the total amount based on the basket value and what's being ordered
  const totalAmount = await orders.calculateTotalOrderValue(orderId);

  if (totalAmount === 0) {
    console.info("Order is free, skipping payment");

    return {
      redirectUrl: `/free-checkout-complete?orderId=${orderId}`,
      mode: "confirmation",
    };
  }

  console.info("Order is contains non-free tickets, creating payment");

  // Kick off Payment
  const paymentResponse = await payment.createPayment({
    orderId: orderId,
    customerEmail: customer.email,
    amount: totalAmount.toString(),
    redirectBaseUrl: `${SCHEME}://${validRequest.subdomain}.${HOST}`,
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
